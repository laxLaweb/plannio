const { query } = require("../db");
const { countPollResponders } = require("./responses");
const { getPollForNotify } = require("./model");
const { notifyPollEvent } = require("../integrations/notify");

async function getDueReminders() {
  const result = await query(
    `SELECT id, poll_id FROM poll_reminders WHERE remind_at <= NOW() AND sent_at IS NULL`,
  );
  return result.rows;
}

async function markReminderSent(id) {
  await query(`UPDATE poll_reminders SET sent_at = NOW() WHERE id = $1`, [id]);
}

async function processPendingReminders() {
  const due = await getDueReminders();

  for (const reminder of due) {
    try {
      const poll = await getPollForNotify(reminder.poll_id);

      const wantsReminder =
        (poll?.discord_webhook_url && poll.discord_events?.includes("reminder")) ||
        (poll?.slack_webhook_url && poll.slack_events?.includes("reminder"));

      if (wantsReminder && !poll.locked_option_id) {
        const responseCount = await countPollResponders(poll.id);
        const alreadyComplete = poll.expected_responses && responseCount >= poll.expected_responses;

        if (!alreadyComplete) {
          await notifyPollEvent(poll, "reminder", {
            responseCount,
            expected: poll.expected_responses,
          });
        }
      }
    } catch (error) {
      console.error(`Reminder failed for poll ${reminder.poll_id}:`, error.message);
    } finally {
      await markReminderSent(reminder.id);
    }
  }
}

module.exports = { processPendingReminders };
