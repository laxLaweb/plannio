// "Sign in with Slack" — Slack's OpenID Connect flow. This is separate from
// the incoming-webhook OAuth used for channel notifications (server/integrations/slack.js):
// different scopes, different endpoints, different redirect URI, same Slack app.
const SLACK_AUTH_URL = "https://slack.com/openid/connect/authorize";
const SLACK_TOKEN_URL = "https://slack.com/api/openid.connect.token";
const SLACK_USERINFO_URL = "https://slack.com/api/openid.connect.userInfo";

function getSlackConfig() {
  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  const redirectUri = process.env.SLACK_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return null;
  }

  return { clientId, clientSecret, redirectUri };
}

function getSlackAuthUrl(state) {
  const config = getSlackConfig();
  if (!config) {
    throw new Error("Slack OAuth is not configured");
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
  });

  return `${SLACK_AUTH_URL}?${params.toString()}`;
}

async function exchangeSlackCode(code) {
  const config = getSlackConfig();
  if (!config) {
    throw new Error("Slack OAuth is not configured");
  }

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "authorization_code",
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
    throw new Error(`Slack token exchange failed: ${data.error || response.statusText}`);
  }

  return data;
}

async function fetchSlackUser(accessToken) {
  const response = await fetch(SLACK_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error("Could not fetch Slack user");
  }

  return data;
}

module.exports = {
  getSlackConfig,
  getSlackAuthUrl,
  exchangeSlackCode,
  fetchSlackUser,
};
