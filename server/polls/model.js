const crypto = require("crypto");
const { getPool, query } = require("../db");
const { countPollResponders } = require("./responses");

function slugify(title) {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  const suffix = crypto.randomBytes(4).toString("hex");
  return `${base || "poll"}-${suffix}`;
}

function normalizeOptions(rawOptions) {
  if (!Array.isArray(rawOptions) || rawOptions.length === 0) {
    throw new Error("At least one date is required");
  }

  return rawOptions.map((option, index) => {
    const date = String(option.date || "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`Invalid date on row ${index + 1}`);
    }

    let endDate = null;
    if (option.endDate) {
      endDate = String(option.endDate).trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
        throw new Error(`Invalid end date on row ${index + 1}`);
      }
      if (endDate <= date) {
        throw new Error(`End date must be after start date on row ${index + 1}`);
      }
    }

    const allDay = Boolean(option.allDay);
    let time = null;
    let endTime = null;

    if (!allDay) {
      time = String(option.time || "").trim();
      if (!/^\d{2}:\d{2}$/.test(time)) {
        throw new Error(`Pick a time or select "All day" on row ${index + 1}`);
      }

      if (option.endTime) {
        endTime = String(option.endTime).trim();
        if (!/^\d{2}:\d{2}$/.test(endTime)) {
          throw new Error(`Invalid end time on row ${index + 1}`);
        }
        if (endTime <= time) {
          throw new Error(`End time must be after start time on row ${index + 1}`);
        }
      }
    }

    return { date, endDate, time, endTime, allDay };
  });
}

const DISCORD_EVENTS = ["created", "vote", "locked", "reminder"];

function normalizeReminders(reminders) {
  if (!Array.isArray(reminders)) {
    return [];
  }

  const now = Date.now();
  const seen = new Set();
  const clean = [];

  for (const value of reminders) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || date.getTime() <= now) {
      continue;
    }
    const iso = date.toISOString();
    if (seen.has(iso)) continue;
    seen.add(iso);
    clean.push(iso);
  }

  return clean.sort();
}

function normalizeDiscord(discord) {
  if (!discord || !discord.webhookUrl) {
    return null;
  }

  const events = Array.isArray(discord.events)
    ? discord.events.filter((event) => DISCORD_EVENTS.includes(event))
    : [];

  return {
    webhookUrl: String(discord.webhookUrl),
    webhookId: discord.webhookId ? String(discord.webhookId) : null,
    channelId: discord.channelId ? String(discord.channelId) : null,
    guildId: discord.guildId ? String(discord.guildId) : null,
    events,
  };
}

function normalizeSlack(slack) {
  if (!slack || !slack.webhookUrl) {
    return null;
  }

  const events = Array.isArray(slack.events)
    ? slack.events.filter((event) => DISCORD_EVENTS.includes(event))
    : [];

  return {
    webhookUrl: String(slack.webhookUrl),
    channelName: slack.channelName ? String(slack.channelName) : null,
    teamId: slack.teamId ? String(slack.teamId) : null,
    events,
  };
}

function normalizeExpected(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }
  return parsed;
}

async function createPoll({
  userId,
  title,
  description,
  options,
  discord,
  slack,
  reminders,
  expectedResponses,
  requireLogin = false,
  hideVoterNames = false,
  allowMaybe = true,
  requireAllDates = true,
  voterName,
}) {
  const cleanTitle = String(title || "").trim();
  if (!cleanTitle) {
    throw new Error("The poll needs a title");
  }

  const cleanOptions = normalizeOptions(options);
  const slug = slugify(cleanTitle);
  const cleanDescription = description ? String(description).trim() : null;
  const cleanDiscord = normalizeDiscord(discord);
  const cleanSlack = normalizeSlack(slack);
  const cleanExpected = normalizeExpected(expectedResponses);
  const cleanRequireLogin = requireLogin === true;
  const cleanHideVoterNames = hideVoterNames === true;
  const cleanAllowMaybe = allowMaybe !== false;
  const cleanRequireAllDates = requireAllDates !== false;

  const wantsReminders =
    cleanDiscord?.events.includes("reminder") || cleanSlack?.events.includes("reminder");
  const cleanReminders = wantsReminders ? normalizeReminders(reminders) : [];

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const pollResult = await client.query(
      `INSERT INTO polls
         (user_id, title, slug, description, expected_responses, require_login, hide_voter_names,
          allow_maybe, require_all_dates,
          discord_webhook_url, discord_webhook_id, discord_channel_id, discord_guild_id, discord_events,
          slack_webhook_url, slack_channel_name, slack_team_id, slack_events)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING id, user_id, title, slug, description, created_at, require_login, hide_voter_names,
                 allow_maybe, require_all_dates`,
      [
        userId,
        cleanTitle,
        slug,
        cleanDescription,
        cleanExpected,
        cleanRequireLogin,
        cleanHideVoterNames,
        cleanAllowMaybe,
        cleanRequireAllDates,
        cleanDiscord?.webhookUrl || null,
        cleanDiscord?.webhookId || null,
        cleanDiscord?.channelId || null,
        cleanDiscord?.guildId || null,
        cleanDiscord?.events || [],
        cleanSlack?.webhookUrl || null,
        cleanSlack?.channelName || null,
        cleanSlack?.teamId || null,
        cleanSlack?.events || [],
      ],
    );

    const poll = pollResult.rows[0];

    for (const option of cleanOptions) {
      const optionResult = await client.query(
        `INSERT INTO poll_options (poll_id, option_date, end_date, start_time, end_time, all_day)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [poll.id, option.date, option.endDate, option.time, option.endTime, option.allDay],
      );

      // Opretteren stemmer automatisk "ja" på alle datoer de foreslår
      await client.query(
        `INSERT INTO votes (poll_option_id, user_id, voter_name, status)
         VALUES ($1, $2, $3, 'yes')`,
        [optionResult.rows[0].id, userId, voterName || null],
      );
    }

    for (const remindAt of cleanReminders) {
      await client.query(
        `INSERT INTO poll_reminders (poll_id, remind_at) VALUES ($1, $2)`,
        [poll.id, remindAt],
      );
    }

    await client.query("COMMIT");
    return poll;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function listPollsByUser(userId) {
  const result = await query(
    `SELECT p.id, p.title, p.slug, p.description, p.created_at,
            p.expected_responses, p.locked_option_id,
            COUNT(o.id)::int AS option_count
     FROM polls p
     LEFT JOIN poll_options o ON o.poll_id = p.id
     WHERE p.user_id = $1
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    [userId],
  );

  const polls = result.rows;
  for (const poll of polls) {
    poll.response_count = await countPollResponders(poll.id);
  }
  return polls;
}

async function loadOptions(pollId) {
  const optionsResult = await query(
    `SELECT id,
            to_char(option_date, 'YYYY-MM-DD') AS option_date,
            to_char(end_date, 'YYYY-MM-DD') AS end_date,
            to_char(start_time, 'HH24:MI') AS start_time,
            to_char(end_time, 'HH24:MI') AS end_time,
            all_day
     FROM poll_options
     WHERE poll_id = $1
     ORDER BY option_date, start_time NULLS FIRST`,
    [pollId],
  );
  return optionsResult.rows;
}

async function loadOptionsWithVotes(pollId) {
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
    [pollId],
  );
  return optionsResult.rows;
}

async function countResponders(pollId) {
  return countPollResponders(pollId);
}

async function getPollByIdForUser(pollId, userId) {
  const pollResult = await query(
    `SELECT id, title, slug, description, created_at,
            expected_responses, require_login, hide_voter_names, allow_maybe, require_all_dates,
            locked_option_id,
            discord_events, slack_events,
            (discord_webhook_url IS NOT NULL) AS discord_connected,
            (slack_webhook_url IS NOT NULL) AS slack_connected
     FROM polls
     WHERE id = $1 AND user_id = $2`,
    [pollId, userId],
  );

  const poll = pollResult.rows[0];
  if (!poll) {
    return null;
  }

  poll.options = await loadOptionsWithVotes(pollId);
  poll.response_count = await countResponders(pollId);
  return poll;
}

async function markCompletedNotified(pollId) {
  await query(`UPDATE polls SET completed_notified = true WHERE id = $1`, [pollId]);
}

async function lockPollOption(pollId, userId, optionId) {
  if (optionId) {
    const check = await query(
      `SELECT id FROM poll_options WHERE id = $1 AND poll_id = $2`,
      [optionId, pollId],
    );
    if (!check.rows[0]) {
      throw new Error("Invalid option for this poll");
    }
  }

  const result = await query(
    `UPDATE polls SET locked_option_id = $1
     WHERE id = $2 AND user_id = $3
     RETURNING id`,
    [optionId || null, pollId, userId],
  );

  if (!result.rows[0]) {
    throw new Error("Poll not found");
  }
}

// GDPR art. 17: poll-ejeren kan slette afstemningen inkl. alle stemmer.
// ON DELETE CASCADE fjerner options, votes og reminders.
async function deletePoll(pollId, userId) {
  const result = await query(
    `DELETE FROM polls WHERE id = $1 AND user_id = $2 RETURNING id`,
    [pollId, userId],
  );

  if (!result.rows[0]) {
    throw new Error("Poll not found");
  }
}

// Intern brug: inkluderer webhook-URL – må ikke returneres til klienten.
async function getPollForNotify(pollId) {
  const pollResult = await query(
    `SELECT id, title, slug, description, created_at,
            expected_responses, completed_notified, locked_option_id, hide_voter_names,
            discord_webhook_url, discord_events,
            slack_webhook_url, slack_events
     FROM polls
     WHERE id = $1`,
    [pollId],
  );

  const poll = pollResult.rows[0];
  if (!poll) {
    return null;
  }

  poll.options = await loadOptions(pollId);
  return poll;
}

module.exports = {
  createPoll,
  listPollsByUser,
  getPollByIdForUser,
  getPollForNotify,
  markCompletedNotified,
  lockPollOption,
  deletePoll,
};
