const { shareUrlFor, formatOptionLabel, formatOptionLine } = require("./shared");

const SLACK_AUTH_URL = "https://slack.com/oauth/v2/authorize";
const SLACK_TOKEN_URL = "https://slack.com/api/oauth.v2.access";

const BRAND_COLOR = "#7c5cff";
const GREEN = "#22c55e";
const AMBER = "#f59e0b";

function getWebhookConfig() {
  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  const redirectUri =
    process.env.SLACK_WEBHOOK_REDIRECT_URI ||
    "http://localhost:5000/api/integrations/slack/callback";

  if (!clientId || !clientSecret) {
    return null;
  }

  return { clientId, clientSecret, redirectUri };
}

function getWebhookAuthUrl(state) {
  const config = getWebhookConfig();
  if (!config) {
    throw new Error("Slack is not configured");
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: "incoming-webhook",
    state,
  });

  return `${SLACK_AUTH_URL}?${params.toString()}`;
}

async function exchangeWebhookCode(code) {
  const config = getWebhookConfig();
  if (!config) {
    throw new Error("Slack is not configured");
  }

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.redirectUri,
  });

  const response = await fetch(SLACK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(`Slack webhook authorization failed: ${data.error || response.statusText}`);
  }

  return data;
}

async function sendSlackMessage(webhookUrl, payload) {
  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`Slack message failed (${response.status}): ${text}`);
    }
  } catch (error) {
    console.error("Slack message failed:", error.message);
  }
}

function actionButton(text, url) {
  return {
    type: "actions",
    elements: [
      {
        type: "button",
        text: { type: "plain_text", text, emoji: true },
        url,
      },
    ],
  };
}

function buildMessage(poll, event, data = {}) {
  const shareUrl = shareUrlFor(poll);

  switch (event) {
    case "created": {
      const lines = (poll.options || []).map(formatOptionLine).join("\n") || "No dates yet";
      return {
        color: BRAND_COLOR,
        headerText: `📅 New poll: ${poll.title}`,
        bodyText: `${poll.description || "Vote for the best time."}\n\n*Proposed times*\n${lines}`,
        buttonText: "Vote here",
        shareUrl,
      };
    }
    case "vote": {
      const who = data.voterName || "A participant";
      const lines = (data.options || []).map(formatOptionLine).join("\n") || "None of the proposed dates";
      return {
        color: BRAND_COLOR,
        headerText: `🗳️ ${who} responded`,
        bodyText: `in poll *${poll.title}*\n\n*Can attend*\n${lines}`,
        buttonText: "View poll",
        shareUrl,
      };
    }
    case "locked":
      return {
        color: GREEN,
        headerText: `✅ Time locked for ${poll.title}`,
        bodyText: data.when
          ? `The chosen time is: *${data.when}*`
          : "A time has been selected.",
        buttonText: "Details",
        shareUrl,
      };
    case "reminder":
      return {
        color: AMBER,
        headerText: `⏰ Reminder: ${poll.title}`,
        bodyText:
          data.responseCount != null && data.expected
            ? `${data.responseCount}/${data.expected} people have responded so far. Share your availability if you haven't yet!`
            : "Some people still haven't voted. Share your availability!",
        buttonText: "Vote here",
        shareUrl,
      };
    case "completed":
      return {
        color: GREEN,
        headerText: `🎉 Everyone has responded: ${poll.title}`,
        bodyText: data.expected
          ? `All ${data.expected} expected participants have now completed the poll.`
          : "All expected participants have now completed the poll.",
        buttonText: "View results",
        shareUrl,
      };
    default:
      return null;
  }
}

function buildBlocks({ headerText, bodyText, buttonText, shareUrl, color }) {
  const blocks = [
    { type: "header", text: { type: "plain_text", text: headerText, emoji: true } },
    { type: "section", text: { type: "mrkdwn", text: bodyText } },
    actionButton(buttonText, shareUrl),
  ];

  return {
    username: "Plannio",
    attachments: [{ color, blocks }],
  };
}

async function notifySlackEvent(poll, event, data = {}, options = {}) {
  if (!poll?.slack_webhook_url) return;

  const enabled = Array.isArray(poll.slack_events) ? poll.slack_events : [];
  if (!options.force && event !== "completed" && !enabled.includes(event)) return;

  const message = buildMessage(poll, event, data);
  if (!message) return;

  await sendSlackMessage(poll.slack_webhook_url, buildBlocks(message));
}

module.exports = {
  getWebhookConfig,
  getWebhookAuthUrl,
  exchangeWebhookCode,
  sendSlackMessage,
  notifySlackEvent,
  formatOptionLabel,
};
