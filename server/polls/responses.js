const { query } = require("../db");

async function countPollResponders(pollId) {
  const result = await query(
    `SELECT COUNT(*)::int AS count FROM (
       SELECT v.user_id::text AS responder_key
       FROM votes v
       JOIN poll_options o ON o.id = v.poll_option_id
       WHERE o.poll_id = $1 AND v.user_id IS NOT NULL
       UNION
       SELECT lower(trim(v.voter_name))
       FROM votes v
       JOIN poll_options o ON o.id = v.poll_option_id
       WHERE o.poll_id = $1 AND v.user_id IS NULL AND trim(v.voter_name) <> ''
     ) responders`,
    [pollId],
  );
  return result.rows[0]?.count || 0;
}

module.exports = { countPollResponders };
