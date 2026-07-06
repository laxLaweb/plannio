const DISCORD_AUTH_URL = "https://discord.com/api/oauth2/authorize";
const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
const DISCORD_USER_URL = "https://discord.com/api/users/@me";

function getDiscordConfig() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return null;
  }

  return { clientId, clientSecret, redirectUri };
}

function getDiscordAuthUrl(state) {
  const config = getDiscordConfig();
  if (!config) {
    throw new Error("Discord OAuth is not configured");
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "identify email",
    state,
    prompt: "consent",
  });

  return `${DISCORD_AUTH_URL}?${params.toString()}`;
}

async function exchangeDiscordCode(code) {
  const config = getDiscordConfig();
  if (!config) {
    throw new Error("Discord OAuth is not configured");
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
    throw new Error(`Discord token exchange failed: ${error}`);
  }

  return response.json();
}

async function fetchDiscordUser(accessToken) {
  const response = await fetch(DISCORD_USER_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Could not fetch Discord user");
  }

  return response.json();
}

function getDiscordAvatarUrl(discordUser) {
  if (discordUser.avatar) {
    return `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`;
  }

  const defaultIndex = Number(BigInt(discordUser.id) >> 22n) % 6;
  return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
}

module.exports = {
  getDiscordConfig,
  getDiscordAuthUrl,
  exchangeDiscordCode,
  fetchDiscordUser,
  getDiscordAvatarUrl,
};
