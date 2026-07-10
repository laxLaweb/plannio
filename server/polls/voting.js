const { getPool, query } = require("../db");
const { countPollResponders } = require("./responses");

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
            COUNT(v.id)::int AS vote_count,
            COALESCE(
              json_agg(v.voter_name ORDER BY v.created_at)
              FILTER (WHERE v.id IS NOT NULL),
              '[]'
            ) AS voters
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
    }
  }

  return poll;
}

async function getUserVotes(pollId, userId) {
  const result = await query(
    `SELECT v.poll_option_id
     FROM votes v
     JOIN poll_options o ON o.id = v.poll_option_id
     WHERE o.poll_id = $1 AND v.user_id = $2`,
    [pollId, userId],
  );
  return result.rows.map((row) => row.poll_option_id);
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
    `SELECT v.poll_option_id
     FROM votes v
     JOIN poll_options o ON o.id = v.poll_option_id
     WHERE o.poll_id = $1 AND v.user_id IS NULL
       AND lower(trim(v.voter_name)) = lower($2)`,
    [pollId, cleanName],
  );
  return result.rows.map((row) => row.poll_option_id);
}

async function submitAuthenticatedVote({ pollId, userId, voterName, optionIds }) {
  const ids = Array.isArray(optionIds) ? [...new Set(optionIds.map(String))] : [];

  const validResult = await query(
    `SELECT id FROM poll_options WHERE poll_id = $1`,
    [pollId],
  );
  const validIds = new Set(validResult.rows.map((row) => row.id));
  const chosen = ids.filter((id) => validIds.has(id));

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

    for (const optionId of chosen) {
      await client.query(
        `INSERT INTO votes (poll_option_id, user_id, voter_name)
         VALUES ($1, $2, $3)`,
        [optionId, userId, voterName],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return { chosen, voterName };
}

async function submitAnonymousVote({ pollId, voterName, optionIds }) {
  const cleanName = normalizeVoterName(voterName);
  const ids = Array.isArray(optionIds) ? [...new Set(optionIds.map(String))] : [];

  const validResult = await query(
    `SELECT id FROM poll_options WHERE poll_id = $1`,
    [pollId],
  );
  const validIds = new Set(validResult.rows.map((row) => row.id));
  const chosen = ids.filter((id) => validIds.has(id));

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

    for (const optionId of chosen) {
      await client.query(
        `INSERT INTO votes (poll_option_id, user_id, voter_name)
         VALUES ($1, NULL, $2)`,
        [optionId, cleanName],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return { chosen, voterName: cleanName };
}

module.exports = {
  getPollBySlug,
  getUserVotes,
  getAnonymousVoterNames,
  getAnonymousVotes,
  submitAuthenticatedVote,
  submitAnonymousVote,
};
