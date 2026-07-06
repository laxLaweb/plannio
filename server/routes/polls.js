const { Router } = require("express");
const { requireAuth } = require("../auth/middleware");
const {
  createPoll,
  listPollsByUser,
  getPollByIdForUser,
  getPollForNotify,
  lockPollOption,
} = require("../polls/model");
const { notifyPollEvent } = require("../integrations/notify");
const { formatOptionLabel } = require("../integrations/shared");

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const polls = await listPollsByUser(req.session.userId);
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, options, discord, slack, reminders, expectedResponses, requireLogin } =
      req.body;

    // Webhook-URL'erne kommer fra sessionen (OAuth-flowet), ikke fra klienten.
    const pendingDiscord = req.session.pendingDiscordWebhook;
    let discordConfig = null;
    if (discord?.enabled && pendingDiscord?.url) {
      discordConfig = {
        webhookUrl: pendingDiscord.url,
        webhookId: pendingDiscord.webhookId,
        channelId: pendingDiscord.channelId,
        guildId: pendingDiscord.guildId,
        events: Array.isArray(discord.events) ? discord.events : [],
      };
    }

    const pendingSlack = req.session.pendingSlackWebhook;
    let slackConfig = null;
    if (slack?.enabled && pendingSlack?.url) {
      slackConfig = {
        webhookUrl: pendingSlack.url,
        channelName: pendingSlack.channelName,
        teamId: pendingSlack.teamId,
        events: Array.isArray(slack.events) ? slack.events : [],
      };
    }

    const poll = await createPoll({
      userId: req.session.userId,
      title,
      description,
      options,
      discord: discordConfig,
      slack: slackConfig,
      reminders,
      expectedResponses,
      requireLogin,
      voterName: req.session.user?.displayName || "Creator",
      voterEmail: req.session.user?.email || null,
    });

    delete req.session.pendingDiscordWebhook;
    delete req.session.pendingSlackWebhook;

    if (discordConfig || slackConfig) {
      const fullPoll = await getPollForNotify(poll.id);
      notifyPollEvent(fullPoll, "created").catch((err) =>
        console.error("Notification failed:", err.message),
      );
    }

    res.status(201).json(poll);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const poll = await getPollByIdForUser(req.params.id, req.session.userId);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }
    res.json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/lock", async (req, res) => {
  try {
    const { optionId } = req.body;
    await lockPollOption(req.params.id, req.session.userId, optionId || null);

    if (optionId) {
      const fullPoll = await getPollForNotify(req.params.id);
      const option = fullPoll?.options.find((o) => o.id === optionId);
      if ((fullPoll?.discord_webhook_url || fullPoll?.slack_webhook_url) && option) {
        notifyPollEvent(fullPoll, "locked", { when: formatOptionLabel(option) }).catch((err) =>
          console.error("Notification failed:", err.message),
        );
      }
    }

    const poll = await getPollByIdForUser(req.params.id, req.session.userId);
    res.json(poll);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/:id/remind", async (req, res) => {
  try {
    const poll = await getPollByIdForUser(req.params.id, req.session.userId);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }
    if (!poll.discord_connected && !poll.slack_connected) {
      return res.status(400).json({ error: "Connect a Discord or Slack channel first" });
    }
    if (poll.locked_option_id) {
      return res.status(400).json({ error: "This poll's time is already locked in" });
    }
    if (poll.expected_responses && poll.response_count >= poll.expected_responses) {
      return res.status(400).json({ error: "Everyone has already responded" });
    }

    const fullPoll = await getPollForNotify(req.params.id);
    await notifyPollEvent(
      fullPoll,
      "reminder",
      { responseCount: poll.response_count, expected: poll.expected_responses },
      { force: true },
    );

    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
