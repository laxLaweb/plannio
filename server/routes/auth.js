const express = require("express");
const rateLimit = require("express-rate-limit");
const { createOAuthState } = require("../auth/session");
const { requireAuth } = require("../auth/middleware");
const {
  getDiscordConfig,
  getDiscordAuthUrl,
  exchangeDiscordCode,
  fetchDiscordUser,
} = require("../auth/discord");
const {
  getSlackConfig,
  getSlackAuthUrl,
  exchangeSlackCode,
  fetchSlackUser,
} = require("../auth/slack");
const {
  upsertDiscordUser,
  upsertSlackUser,
  findUserByEmailWithPassword,
  createUserWithPassword,
  deleteUserById,
  exportUserData,
  buildSessionUser,
} = require("../auth/users");
const { verifyPassword } = require("../auth/password");

const router = express.Router();

// GDPR art. 32: bremser brute force mod password-login og registrering.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many attempts — try again in 15 minutes" },
});

// Regenerér session-ID ved login for at forhindre session fixation,
// og gem først derefter brugeren på den nye session.
function establishSession(req, user, loginProvider, done) {
  req.session.regenerate((error) => {
    if (error) {
      return done(error);
    }
    req.session.userId = user.id;
    buildSessionUser(user.id, loginProvider)
      .then((sessionUser) => {
        req.session.user = sessionUser;
        req.session.save(done);
      })
      .catch(done);
  });
}

function getAppUrl() {
  return process.env.APP_URL || "http://localhost:3000";
}

function redirectWithError(res, message) {
  const params = new URLSearchParams({ error: message });
  res.redirect(`${getAppUrl()}/login?${params.toString()}`);
}

function redirectAccountError(res, message) {
  const params = new URLSearchParams({ error: message });
  res.redirect(`${getAppUrl()}/account?${params.toString()}`);
}

async function refreshSessionUser(req, loginProvider) {
  const sessionUser = await buildSessionUser(req.session.userId, loginProvider);
  if (sessionUser) {
    req.session.user = sessionUser;
  }
  return sessionUser;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function validateEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address");
  }
}

function validateDisplayName(displayName) {
  if (!displayName || displayName.length < 1) {
    throw new Error("Enter a display name");
  }
  if (displayName.length > 60) {
    throw new Error("Display name is too long");
  }
}

function validatePassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
}

router.get("/providers", (_req, res) => {
  res.json({
    discord: Boolean(getDiscordConfig()),
    slack: Boolean(getSlackConfig()),
    google: false,
    apple: false,
  });
});

// 200 (not 401) for anonymous visitors: a 401 here logs a console error in the
// browser on every page load, which hurts Lighthouse Best Practices.
router.get("/me", async (req, res) => {
  if (!req.session?.userId) {
    return res.json({ user: null });
  }

  try {
    const user = await refreshSessionUser(req, req.session.user?.loginProvider);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/link/discord", requireAuth, (req, res) => {
  if (!getDiscordConfig()) {
    return res.status(503).json({ error: "Discord login is not configured yet" });
  }

  const state = createOAuthState();
  req.session.oauthState = state;
  req.session.oauthLinkMode = "discord";

  req.session.save((error) => {
    if (error) {
      console.error("Session save fejl:", error.message);
      return redirectAccountError(res, "Could not start Discord linking");
    }
    res.redirect(getDiscordAuthUrl(state));
  });
});

router.get("/link/slack", requireAuth, (req, res) => {
  if (!getSlackConfig()) {
    return res.status(503).json({ error: "Slack login is not configured yet" });
  }

  const state = createOAuthState();
  req.session.slackOauthState = state;
  req.session.oauthLinkMode = "slack";

  req.session.save((error) => {
    if (error) {
      console.error("Session save fejl:", error.message);
      return redirectAccountError(res, "Could not start Slack linking");
    }
    res.redirect(getSlackAuthUrl(state));
  });
});

router.get("/discord", (req, res) => {
  if (!getDiscordConfig()) {
    return res.status(503).json({ error: "Discord login is not configured yet" });
  }

  const state = createOAuthState();
  req.session.oauthState = state;

  req.session.save((error) => {
    if (error) {
      console.error("Session save fejl:", error.message);
      return redirectWithError(res, "Database connection failed — check DATABASE_URL and SSL");
    }
    res.redirect(getDiscordAuthUrl(state));
  });
});

router.get("/discord/callback", async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return redirectWithError(res, "Discord login was cancelled");
  }

  if (!code || !state || state !== req.session.oauthState) {
    return redirectWithError(res, "Invalid login request");
  }

  delete req.session.oauthState;

  const linkMode = req.session.oauthLinkMode === "discord";
  if (linkMode) {
    delete req.session.oauthLinkMode;
  }

  try {
    const token = await exchangeDiscordCode(code);
    const discordUser = await fetchDiscordUser(token.access_token);

    if (linkMode && req.session.userId) {
      await upsertDiscordUser(discordUser, req.session.userId);
      await refreshSessionUser(req, req.session.user?.loginProvider);

      return req.session.save((saveError) => {
        if (saveError) {
          return redirectAccountError(res, "Could not save session");
        }
        res.redirect(`${getAppUrl()}/account?linked=discord`);
      });
    }

    if (linkMode) {
      return redirectAccountError(res, "Session expired — sign in again and retry linking");
    }

    const user = await upsertDiscordUser(discordUser, req.session.userId || null);

    establishSession(req, user, "discord", (saveError) => {
      if (saveError) {
        return redirectWithError(res, "Could not create session");
      }
      res.redirect(getAppUrl());
    });
  } catch (callbackError) {
    console.error("Discord callback fejl:", callbackError.message);
    if (linkMode) {
      return redirectAccountError(res, callbackError.message);
    }
    redirectWithError(res, "Login failed — try again");
  }
});

router.get("/slack", (req, res) => {
  if (!getSlackConfig()) {
    return res.status(503).json({ error: "Slack login is not configured yet" });
  }

  const state = createOAuthState();
  req.session.slackOauthState = state;

  req.session.save((error) => {
    if (error) {
      console.error("Session save fejl:", error.message);
      return redirectWithError(res, "Database connection failed — check DATABASE_URL and SSL");
    }
    res.redirect(getSlackAuthUrl(state));
  });
});

router.get("/slack/callback", async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return redirectWithError(res, "Slack login was cancelled");
  }

  if (!code || !state || state !== req.session.slackOauthState) {
    return redirectWithError(res, "Invalid login request");
  }

  delete req.session.slackOauthState;

  const linkMode = req.session.oauthLinkMode === "slack";
  if (linkMode) {
    delete req.session.oauthLinkMode;
  }

  try {
    const token = await exchangeSlackCode(code);
    const slackUser = await fetchSlackUser(token.access_token);

    if (linkMode && req.session.userId) {
      await upsertSlackUser(slackUser, req.session.userId);
      await refreshSessionUser(req, req.session.user?.loginProvider);

      return req.session.save((saveError) => {
        if (saveError) {
          return redirectAccountError(res, "Could not save session");
        }
        res.redirect(`${getAppUrl()}/account?linked=slack`);
      });
    }

    if (linkMode) {
      return redirectAccountError(res, "Session expired — sign in again and retry linking");
    }

    const user = await upsertSlackUser(slackUser, req.session.userId || null);

    establishSession(req, user, "slack", (saveError) => {
      if (saveError) {
        return redirectWithError(res, "Could not create session");
      }
      res.redirect(getAppUrl());
    });
  } catch (callbackError) {
    console.error("Slack callback fejl:", callbackError.message);
    if (linkMode) {
      return redirectAccountError(res, callbackError.message);
    }
    redirectWithError(res, "Login failed — try again");
  }
});

router.post("/register", authLimiter, async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const displayName = String(req.body.displayName || "").trim();

    validateEmail(email);
    validateDisplayName(displayName);
    validatePassword(password);

    const existing = await findUserByEmailWithPassword(email);
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const user = await createUserWithPassword({ email, password, displayName });

    establishSession(req, user, "password", (error) => {
      if (error) {
        return res.status(500).json({ error: "Could not create session" });
      }
      res.status(201).json({ user: req.session.user });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", authLimiter, async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    const user = await findUserByEmailWithPassword(email);
    if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    establishSession(req, user, "password", (error) => {
      if (error) {
        return res.status(500).json({ error: "Could not create session" });
      }
      res.json({ user: req.session.user });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ error: "Could not log out" });
    }
    res.clearCookie("plannio.sid");
    res.json({ ok: true });
  });
});

// GDPR art. 15/20: indsigt og dataportabilitet — download alle egne data som JSON.
router.get("/export", requireAuth, async (req, res) => {
  try {
    const data = await exportUserData(req.session.userId);
    res.setHeader("Content-Disposition", 'attachment; filename="plannio-data-export.json"');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GDPR art. 17: slet konto og alt tilknyttet data (polls, stemmer, identiteter).
router.delete("/account", requireAuth, async (req, res) => {
  try {
    await deleteUserById(req.session.userId);
    req.session.destroy((error) => {
      if (error) {
        console.error("Session destroy fejl:", error.message);
      }
      res.clearCookie("plannio.sid");
      res.json({ ok: true });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
