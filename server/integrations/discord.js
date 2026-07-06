const { shareUrlFor, formatOptionLabel, formatOptionLine } = require("./shared");

const DISCORD_AUTH_URL = "https://discord.com/api/oauth2/authorize";
const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";

const BRAND_COLOR = 0x7c5cff;

function getWebhookConfig() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri =
    process.env.DISCORD_WEBHOOK_REDIRECT_URI ||
    "http://localhost:5000/api/integrations/discord/callback";

  if (!clientId || !clientSecret) {
    return null;
  }

  return { clientId, clientSecret, redirectUri };
}

function getWebhookAuthUrl(state) {
  const config = getWebhookConfig();
  if (!config) {
    throw new Error("Discord is not configured");
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "identify webhook.incoming",
    state,
  });

  return `${DISCORD_AUTH_URL}?${params.toString()}`;
}

async function exchangeWebhookCode(code) {
  const config = getWebhookConfig();
  if (!config) {
    throw new Error("Discord is not configured");
  }

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUri,
  });

  const response = await fetch(DISCORD_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Discord webhook authorization failed: ${error}`);
  }

  return response.json();
}

async function sendDiscordMessage(webhookUrl, payload) {
  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`Discord message failed (${response.status}): ${text}`);
    }
  } catch (error) {
    console.error("Discord message failed:", error.message);
  }
}

function buildEmbed(poll, event, data = {}) {
  const shareUrl = shareUrlFor(poll);

  switch (event) {
    case "created": {
      const lines = (poll.options || []).map(formatOptionLine).join("\n");
      return {
        title: `📅 New poll: ${poll.title}`,
        description: poll.description || "Vote for the best time.",
        color: BRAND_COLOR,
        fields: [
          {
            name: "Proposed times",
            value: lines || "No dates yet",
          },
          { name: "Vote here", value: shareUrl },
        ],
      };
    }
    case "vote": {
      const who = data.voterName || "A participant";
      const lines = (data.options || []).map(formatOptionLine).join("\n");
      return {
        title: `🗳️ ${who} responded`,
        description: `in poll **${poll.title}**`,
        color: BRAND_COLOR,
        fields: [
          { name: "Can attend", value: lines || "None of the proposed dates" },
          { name: "View poll", value: shareUrl },
        ],
      };
    }
    case "locked":
      return {
        title: `✅ Time locked for ${poll.title}`,
        description: data.when ? `The chosen time is: **${data.when}**` : "A time has been selected.",
        color: 0x22c55e,
        fields: [{ name: "Details", value: shareUrl }],
      };
    case "reminder":
      return {
        title: `⏰ Reminder: ${poll.title}`,
        description:
          data.responseCount != null && data.expected
            ? `${data.responseCount}/${data.expected} people have responded so far. Share your availability if you haven't yet!`
            : "Some people still haven't voted. Share your availability!",
        color: 0xf59e0b,
        fields: [{ name: "Vote here", value: shareUrl }],
      };
    case "completed":
      return {
        title: `🎉 Everyone has responded: ${poll.title}`,
        description: data.expected
          ? `All ${data.expected} expected participants have now completed the poll.`
          : "All expected participants have now completed the poll.",
        color: 0x22c55e,
        fields: [{ name: "View results", value: shareUrl }],
      };
    default:
      return null;
  }
}

async function notifyPollEvent(poll, event, data = {}, options = {}) {
  if (!poll?.discord_webhook_url) return;

  const enabled = Array.isArray(poll.discord_events) ? poll.discord_events : [];
  if (!options.force && event !== "completed" && !enabled.includes(event)) return;

  const embed = buildEmbed(poll, event, data);
  if (!embed) return;

  await sendDiscordMessage(poll.discord_webhook_url, {
    username: "Plannio",
    embeds: [embed],
  });
}

module.exports = {
  getWebhookConfig,
  getWebhookAuthUrl,
  exchangeWebhookCode,
  sendDiscordMessage,
  notifyPollEvent,
  formatOptionLabel,
};
