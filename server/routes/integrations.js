const { Router } = require("express");
const { requireAuth } = require("../auth/middleware");
const { createOAuthState } = require("../auth/session");
const { getUserProviders, linkIdentity, canConnectChannelProvider } = require("../auth/users");
const { fetchDiscordUser } = require("../auth/discord");
const {
  getWebhookConfig: getDiscordWebhookConfig,
  getWebhookAuthUrl: getDiscordWebhookAuthUrl,
  exchangeWebhookCode: exchangeDiscordWebhookCode,
} = require("../integrations/discord");
const {
  getWebhookConfig: getSlackWebhookConfig,
  getWebhookAuthUrl: getSlackWebhookAuthUrl,
  exchangeWebhookCode: exchangeSlackWebhookCode,
} = require("../integrations/slack");

const router = Router();

function getAppUrl() {
  return process.env.APP_URL || "http://localhost:3000";
}

function popupResponse(res, message, title = "Plannio") {
  const appUrl = getAppUrl();
  const payload = JSON.stringify(message);
  res.set("Content-Type", "text/html");
  res.send(`<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>${title}</title></head>
  <body style="font-family: system-ui, sans-serif; background:#0f0f13; color:#fff; display:grid; place-items:center; height:100vh; margin:0;">
    <p>You can close this window.</p>
    <script>
      (function () {
        var data = ${payload};
        if (window.opener) {
          window.opener.postMessage(data, ${JSON.stringify(appUrl)});
        }
        window.close();
      })();
    </script>
  </body>
</html>`);
}

router.get("/discord/status", requireAuth, async (req, res) => {
  try {
    const providers = await getUserProviders(req.session.userId);
    const pending = req.session.pendingDiscordWebhook || null;
    res.json({
      configured: Boolean(getDiscordWebhookConfig()),
      linked: providers.includes("discord"),
      connected: Boolean(pending),
      channelId: pending?.channelId || null,
      guildId: pending?.guildId || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/discord/connect", requireAuth, async (req, res) => {
  const linked = await getUserProviders(req.session.userId);
  if (!canConnectChannelProvider({ ...req.session.user, linkedProviders: linked }, "discord")) {
    return res
      .status(403)
      .send("Connect Discord from your account settings or sign in with Discord first");
  }

  if (!getDiscordWebhookConfig()) {
    return res.status(503).send("Discord is not configured");
  }

  const state = createOAuthState();
  req.session.webhookState = state;

  req.session.save((error) => {
    if (error) {
      console.error("Kunne ikke gemme webhook-state:", error.message);
      return res.status(500).send("Session error");
    }
    res.redirect(getDiscordWebhookAuthUrl(state));
  });
});

router.get("/discord/callback", async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return popupResponse(res, { type: "discord-webhook", ok: false, error: "cancelled" }, "Discord");
  }

  if (!code || !state || state !== req.session.webhookState) {
    return popupResponse(
      res,
      { type: "discord-webhook", ok: false, error: "invalid request" },
      "Discord",
    );
  }

  delete req.session.webhookState;

  try {
    const token = await exchangeDiscordWebhookCode(code);
    const webhook = token.webhook;

    if (!webhook?.url) {
      throw new Error("Discord did not return a webhook");
    }

    // Also link this Discord account as a login method, so the user can log in
    // with either their email/password or Discord afterwards, hitting the same account.
    if (req.session.userId && token.access_token) {
      try {
        const discordUser = await fetchDiscordUser(token.access_token);
        await linkIdentity(req.session.userId, "discord", discordUser.id);
      } catch (identityError) {
        console.error("Could not link Discord identity:", identityError.message);
      }
    }

    req.session.pendingDiscordWebhook = {
      url: webhook.url,
      webhookId: webhook.id,
      channelId: webhook.channel_id,
      guildId: webhook.guild_id,
    };

    req.session.save((saveError) => {
      if (saveError) {
        console.error("Kunne ikke gemme webhook:", saveError.message);
        return popupResponse(
          res,
          { type: "discord-webhook", ok: false, error: "session error" },
          "Discord",
        );
      }
      popupResponse(
        res,
        {
          type: "discord-webhook",
          ok: true,
          channelId: webhook.channel_id,
          guildId: webhook.guild_id,
        },
        "Discord",
      );
    });
  } catch (callbackError) {
    console.error("Discord webhook callback fejl:", callbackError.message);
    popupResponse(
      res,
      { type: "discord-webhook", ok: false, error: "authorization failed" },
      "Discord",
    );
  }
});

router.post("/discord/disconnect", requireAuth, (req, res) => {
  delete req.session.pendingDiscordWebhook;
  req.session.save(() => res.json({ ok: true }));
});

router.get("/slack/status", requireAuth, async (req, res) => {
  try {
    const pending = req.session.pendingSlackWebhook || null;
    res.json({
      configured: Boolean(getSlackWebhookConfig()),
      connected: Boolean(pending),
      channelName: pending?.channelName || null,
      teamId: pending?.teamId || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/slack/connect", requireAuth, async (req, res) => {
  const linked = await getUserProviders(req.session.userId);
  if (!canConnectChannelProvider({ ...req.session.user, linkedProviders: linked }, "slack")) {
    return res
      .status(403)
      .send("Connect Slack from your account settings or sign in with Slack first");
  }

  if (!getSlackWebhookConfig()) {
    return res.status(503).send("Slack is not configured");
  }

  const state = createOAuthState();
  req.session.slackWebhookState = state;

  req.session.save((error) => {
    if (error) {
      console.error("Could not save Slack webhook state:", error.message);
      return res.status(500).send("Session error");
    }
    res.redirect(getSlackWebhookAuthUrl(state));
  });
});

router.get("/slack/callback", async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return popupResponse(res, { type: "slack-webhook", ok: false, error: "cancelled" }, "Slack");
  }

  if (!code || !state || state !== req.session.slackWebhookState) {
    return popupResponse(
      res,
      { type: "slack-webhook", ok: false, error: "invalid request" },
      "Slack",
    );
  }

  delete req.session.slackWebhookState;

  try {
    const token = await exchangeSlackWebhookCode(code);
    const webhook = token.incoming_webhook;

    if (!webhook?.url) {
      throw new Error("Slack did not return a webhook");
    }

    req.session.pendingSlackWebhook = {
      url: webhook.url,
      channelName: webhook.channel,
      teamId: token.team?.id || null,
    };

    req.session.save((saveError) => {
      if (saveError) {
        console.error("Could not save Slack webhook:", saveError.message);
        return popupResponse(
          res,
          { type: "slack-webhook", ok: false, error: "session error" },
          "Slack",
        );
      }
      popupResponse(
        res,
        {
          type: "slack-webhook",
          ok: true,
          channelName: webhook.channel,
          teamId: token.team?.id || null,
        },
        "Slack",
      );
    });
  } catch (callbackError) {
    console.error("Slack webhook callback failed:", callbackError.message);
    popupResponse(
      res,
      { type: "slack-webhook", ok: false, error: "authorization failed" },
      "Slack",
    );
  }
});

router.post("/slack/disconnect", requireAuth, (req, res) => {
  delete req.session.pendingSlackWebhook;
  req.session.save(() => res.json({ ok: true }));
});

module.exports = router;
