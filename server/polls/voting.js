const { getPool, query } = require("../db");
const { countPollResponders } = require("./responses");

const VALID_STATUSES = new Set(["yes", "maybe", "no"]);

function normalizeVoterName(name) {
  const clean = String(name || "").trim();
  if (!clean) {
    throw new Error("Enter a name");
  }
  if (clean.length > 100) {
    throw new Error("Name is too long");
  }
  return clean;
}

// Responses come in as { [optionId]: "yes" | "maybe" | "no" }. Options left out
// of the map simply have no vote row (treated as "no answer").
function sanitizeResponses(raw) {
  const clean = {};
  if (raw && typeof raw === "object") {
    for (const [optionId, status] of Object.entries(raw)) {
      if (VALID_STATUSES.has(status)) {
        clean[String(optionId)] = status;
      }
    }
  }
  return clean;
}

async function getPollBySlug(slug) {
  const pollResult = await query(
    `SELECT p.id, p.title, p.slug, p.description, p.created_at, p.expected_responses, p.require_login,
            p.hide_voter_names, p.locked_option_id
     FROM polls p
     WHERE p.slug = $1`,
    [slug],
  );

  const poll = pollResult.rows[0];
  if (!poll) {
    return null;
  }

  poll.response_count = await countPollResponders(poll.id);

  const optionsResult = await query(
    `SELECT o.id,
            to_char(o.option_date, 'YYYY-MM-DD') AS option_date,
            to_char(o.end_date, 'YYYY-MM-DD') AS end_date,
            to_char(o.start_time, 'HH24:MI') AS start_time,
            to_char(o.end_time, 'HH24:MI') AS end_time,
            o.all_day,
            COUNT(v.id) FILTER (WHERE v.status = 'yes')::int AS vote_count,
            COUNT(v.id) FILTER (WHERE v.status = 'maybe')::int AS maybe_count,
            COUNT(v.id) FILTER (WHERE v.status = 'no')::int AS no_count,
            COALESCE(
              json_agg(v.voter_name ORDER BY v.created_at)
              FILTER (WHERE v.id IS NOT NULL AND v.status = 'yes'),
              '[]'
            ) AS voters,
            COALESCE(
              json_agg(json_build_object('name', v.voter_name, 'status', v.status) ORDER BY v.created_at)
              FILTER (WHERE v.id IS NOT NULL),
              '[]'
            ) AS responses
     FROM poll_options o
     LEFT JOIN votes v ON v.poll_option_id = o.id
     WHERE o.poll_id = $1
     GROUP BY o.id
     ORDER BY o.option_date, o.start_time NULLS FIRST`,
    [poll.id],
  );

  poll.options = optionsResult.rows;

  // Privatliv: ejeren kan skjule deltagernavne for andre deltagere.
  if (poll.hide_voter_names) {
    for (const option of poll.options) {
      option.voters = [];
      option.responses = [];
    }
  }

  return poll;
}

async function getUserVotes(pollId, userId) {
  const result = await query(
    `SELECT v.poll_option_id, v.status
     FROM votes v
     JOIN poll_options o ON o.id = v.poll_option_id
     WHERE o.poll_id = $1 AND v.user_id = $2`,
    [pollId, userId],
  );
  const responses = {};
  for (const row of result.rows) {
    responses[row.poll_option_id] = row.status;
  }
  return responses;
}

async function getAnonymousVoterNames(pollId) {
  const result = await query(
    `SELECT DISTINCT trim(v.voter_name) AS name
     FROM votes v
     JOIN poll_options o ON o.id = v.poll_option_id
     WHERE o.poll_id = $1 AND v.user_id IS NULL AND trim(v.voter_name) <> ''
     ORDER BY name`,
    [pollId],
  );
  return result.rows.map((row) => row.name);
}

async function getAnonymousVotes(pollId, voterName) {
  const cleanName = normalizeVoterName(voterName);
  const result = await query(
    `SELECT v.poll_option_id, v.status
     FROM votes v
     JOIN poll_options o ON o.id = v.poll_option_id
     WHERE o.poll_id = $1 AND v.user_id IS NULL
       AND lower(trim(v.voter_name)) = lower($2)`,
    [pollId, cleanName],
  );
  const responses = {};
  for (const row of result.rows) {
    responses[row.poll_option_id] = row.status;
  }
  return responses;
}

async function submitAuthenticatedVote({ pollId, userId, voterName, responses }) {
  const cleanResponses = sanitizeResponses(responses);

  const validResult = await query(`SELECT id FROM poll_options WHERE poll_id = $1`, [pollId]);
  const validIds = new Set(validResult.rows.map((row) => row.id));
  const entries = Object.entries(cleanResponses).filter(([optionId]) => validIds.has(optionId));

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `DELETE FROM votes
       WHERE user_id = $1
         AND poll_option_id IN (SELECT id FROM poll_options WHERE poll_id = $2)`,
      [userId, pollId],
    );

    for (const [optionId, status] of entries) {
      await client.query(
        `INSERT INTO votes (poll_option_id, user_id, voter_name, status)
         VALUES ($1, $2, $3, $4)`,
        [optionId, userId, voterName, status],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const responseMap = Object.fromEntries(entries);
  const chosen = entries.filter(([, status]) => status === "yes").map(([optionId]) => optionId);
  return { responses: responseMap, chosen, voterName };
}

async function submitAnonymousVote({ pollId, voterName, responses }) {
  const cleanName = normalizeVoterName(voterName);
  const cleanResponses = sanitizeResponses(responses);

  const validResult = await query(`SELECT id FROM poll_options WHERE poll_id = $1`, [pollId]);
  const validIds = new Set(validResult.rows.map((row) => row.id));
  const entries = Object.entries(cleanResponses).filter(([optionId]) => validIds.has(optionId));

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `DELETE FROM votes
       WHERE user_id IS NULL
         AND lower(trim(voter_name)) = lower($1)
         AND poll_option_id IN (SELECT id FROM poll_options WHERE poll_id = $2)`,
      [cleanName, pollId],
    );

    for (const [optionId, status] of entries) {
      await client.query(
        `INSERT INTO votes (poll_option_id, user_id, voter_name, status)
         VALUES ($1, NULL, $2, $3)`,
        [optionId, cleanName, status],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const responseMap = Object.fromEntries(entries);
  const chosen = entries.filter(([, status]) => status === "yes").map(([optionId]) => optionId);
  return { responses: responseMap, chosen, voterName: cleanName };
}

module.exports = {
  getPollBySlug,
  getUserVotes,
  getAnonymousVoterNames,
  getAnonymousVotes,
  submitAuthenticatedVote,
  submitAnonymousVote,
};
