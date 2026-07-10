const { query } = require("../db");

// GDPR art. 5(1)(e): opbevaringsbegrænsning. Polls slettes automatisk
// 12 måneder efter seneste aktivitet (oprettelse eller sidste stemme).
// ON DELETE CASCADE rydder options, stemmer og reminders.
// Perioden er dokumenteret i privatlivspolitikken (/privacy) — hold dem i sync.
const RETENTION_MONTHS = 12;

async function deleteExpiredPolls() {
  const result = await query(
    `DELETE FROM polls p
     WHERE p.created_at < NOW() - INTERVAL '${RETENTION_MONTHS} months'
       AND NOT EXISTS (
         SELECT 1
         FROM votes v
         JOIN poll_options o ON o.id = v.poll_option_id
         WHERE o.poll_id = p.id
           AND v.created_at > NOW() - INTERVAL '${RETENTION_MONTHS} months'
       )
     RETURNING p.id`,
  );

  if (result.rowCount > 0) {
    console.log(`Retention: slettede ${result.rowCount} polls ældre end ${RETENTION_MONTHS} måneder.`);
  }

  return result.rowCount;
}

module.exports = { deleteExpiredPolls, RETENTION_MONTHS };
