// Fans a poll event out to every connected channel provider (Discord, Slack, ...).
// Call sites (poll create/lock/remind, vote/completed, the reminder scheduler)
// only need to import this instead of each provider individually.
const discord = require("./discord");
const slack = require("./slack");

async function notifyPollEvent(poll, event, data = {}, options = {}) {
  await Promise.all([
    poll?.discord_webhook_url
      ? discord.notifyPollEvent(poll, event, data, options).catch((err) =>
          console.error("Discord notification failed:", err.message),
        )
      : null,
    poll?.slack_webhook_url
      ? slack.notifySlackEvent(poll, event, data, options).catch((err) =>
          console.error("Slack notification failed:", err.message),
        )
      : null,
  ]);
}

module.exports = { notifyPollEvent };
