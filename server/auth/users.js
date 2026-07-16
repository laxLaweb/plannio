const { query } = require("../db");
const { getDiscordAvatarUrl } = require("../auth/discord");
const { hashPassword } = require("./password");

async function findUserById(userId) {
  const result = await query(
    `SELECT id, email, display_name, avatar_url, created_at FROM users WHERE id = $1`,
    [userId],
  );
  return result.rows[0] || null;
}

async function findUserByProvider(provider, providerUserId) {
  const result = await query(
    `SELECT u.id, u.email, u.display_name, u.avatar_url, u.created_at
     FROM users u
     JOIN user_identities ui ON ui.user_id = u.id
     WHERE ui.provider = $1 AND ui.provider_user_id = $2`,
    [provider, providerUserId],
  );

  return result.rows[0] || null;
}

async function findUserByEmail(email) {
  if (!email) return null;
  const result = await query(
    `SELECT id, email, display_name, avatar_url, created_at FROM users WHERE email = $1`,
    [email],
  );
  return result.rows[0] || null;
}

async function findUserByEmailWithPassword(email) {
  const result = await query(
    `SELECT id, email, display_name, avatar_url, password_hash, created_at
     FROM users WHERE lower(email) = lower($1)`,
    [email],
  );
  return result.rows[0] || null;
}

async function createUserWithPassword({ email, password, displayName }) {
  const passwordHash = hashPassword(password);

  try {
    const result = await query(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, display_name, avatar_url, created_at`,
      [email, passwordHash, displayName],
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("An account with this email already exists");
    }
    throw error;
  }
}

async function getUserProviders(userId) {
  const result = await query(
    `SELECT provider FROM user_identities WHERE user_id = $1`,
    [userId],
  );
  return result.rows.map((row) => row.provider);
}

async function userHasPassword(userId) {
  const result = await query(
    `SELECT (password_hash IS NOT NULL) AS has_password FROM users WHERE id = $1`,
    [userId],
  );
  return Boolean(result.rows[0]?.has_password);
}

async function buildSessionUser(userId, loginProvider) {
  const user = await findUserById(userId);
  if (!user) {
    return null;
  }

  const linkedProviders = await getUserProviders(userId);
  const hasPassword = await userHasPassword(userId);

  return {
    ...serializeUser(user),
    loginProvider: loginProvider || null,
    linkedProviders,
    hasPassword,
  };
}

async function linkIdentity(userId, provider, providerUserId) {
  await query(
    `INSERT INTO user_identities (user_id, provider, provider_user_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (provider, provider_user_id) DO NOTHING`,
    [userId, provider, providerUserId],
  );
}

async function updateUserProfile(userId, { displayName, email, avatarUrl }) {
  const result = await query(
    `UPDATE users
     SET display_name = COALESCE($1, display_name),
         email = COALESCE(email, $2),
         avatar_url = COALESCE($3, avatar_url),
         updated_at = NOW()
     WHERE id = $4
     RETURNING id, email, display_name, avatar_url, created_at`,
    [displayName || null, email || null, avatarUrl || null, userId],
  );
  return result.rows[0];
}

// Generel login-/link-logik der understøtter kontosammenlægning på tværs af providers.
async function upsertOAuthUser({
  provider,
  providerUserId,
  displayName,
  email,
  avatarUrl,
  currentUserId,
}) {
  // 1. Kender vi allerede denne provider-identitet? → log ind på den konto
  const byProvider = await findUserByProvider(provider, providerUserId);
  if (byProvider) {
    if (currentUserId && byProvider.id !== currentUserId) {
      throw new Error("This sign-in method is already linked to another account");
    }
    return updateUserProfile(byProvider.id, {
      displayName,
      email: currentUserId ? null : email,
      avatarUrl: currentUserId ? null : avatarUrl,
    });
  }

  // 2. Brugeren er allerede logget ind → knyt den nye login-metode til samme konto
  if (currentUserId) {
    await linkIdentity(currentUserId, provider, providerUserId);
    // Bevar profil (navn, email, avatar) — linking må ikke overskrive eksisterende data.
    return findUserById(currentUserId);
  }

  // 3. Findes en konto med samme email? → flet den nye login-metode ind i den
  const byEmail = await findUserByEmail(email);
  if (byEmail) {
    await linkIdentity(byEmail.id, provider, providerUserId);
    return updateUserProfile(byEmail.id, { displayName, email, avatarUrl });
  }

  // 4. Ellers: opret en helt ny konto
  const created = await query(
    `INSERT INTO users (email, display_name, avatar_url)
     VALUES ($1, $2, $3)
     RETURNING id, email, display_name, avatar_url, created_at`,
    [email || null, displayName, avatarUrl],
  );

  const user = created.rows[0];
  await linkIdentity(user.id, provider, providerUserId);
  return user;
}

async function upsertDiscordUser(discordUser, currentUserId = null) {
  return upsertOAuthUser({
    provider: "discord",
    providerUserId: discordUser.id,
    displayName: discordUser.global_name || discordUser.username,
    email: discordUser.email || null,
    avatarUrl: getDiscordAvatarUrl(discordUser),
    currentUserId,
  });
}

async function upsertSlackUser(slackUser, currentUserId = null) {
  return upsertOAuthUser({
    provider: "slack",
    providerUserId: slackUser.sub,
    displayName: slackUser.name || slackUser.email || "Slack user",
    email: slackUser.email || null,
    avatarUrl: slackUser.picture || null,
    currentUserId,
  });
}

function canConnectChannelProvider({ loginProvider, linkedProviders }, provider) {
  const linked = linkedProviders || [];
  if (linked.includes(provider)) return true;
  if (loginProvider === "password") return true;
  return loginProvider === provider;
}

function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    avatarUrl: user.avatar_url,
  };
}

// GDPR art. 17: sletter kontoen og alt tilknyttet data.
// ON DELETE CASCADE fjerner user_identities, polls (inkl. options,
// stemmer og reminders via deres egne cascades) og brugerens stemmer.
async function deleteUserById(userId) {
  await query(`DELETE FROM users WHERE id = $1`, [userId]);
}

// GDPR art. 15/20: samlet udtræk af alle personoplysninger vi har om brugeren.
async function exportUserData(userId) {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const providers = await getUserProviders(userId);

  const pollsResult = await query(
    `SELECT id, title, slug, description, created_at, expected_responses, require_login
     FROM polls
     WHERE user_id = $1
     ORDER BY created_at`,
    [userId],
  );

  const votesResult = await query(
    `SELECT p.title AS poll_title,
            to_char(o.option_date, 'YYYY-MM-DD') AS option_date,
            to_char(o.start_time, 'HH24:MI') AS start_time,
            v.voter_name,
            v.created_at
     FROM votes v
     JOIN poll_options o ON o.id = v.poll_option_id
     JOIN polls p ON p.id = o.poll_id
     WHERE v.user_id = $1
     ORDER BY v.created_at`,
    [userId],
  );

  return {
    exportedAt: new Date().toISOString(),
    profile: {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
      linkedProviders: providers,
    },
    polls: pollsResult.rows,
    votes: votesResult.rows,
  };
}

module.exports = {
  findUserById,
  findUserByProvider,
  findUserByEmail,
  findUserByEmailWithPassword,
  createUserWithPassword,
  getUserProviders,
  userHasPassword,
  buildSessionUser,
  canConnectChannelProvider,
  linkIdentity,
  upsertOAuthUser,
  upsertDiscordUser,
  upsertSlackUser,
  serializeUser,
  deleteUserById,
  exportUserData,
};
