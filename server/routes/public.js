const { Router } = require("express");
const {
  getPollBySlug,
  getUserVotes,
  getAnonymousVoterNames,
  getAnonymousVotes,
  submitAuthenticatedVote,
  submitAnonymousVote,
} = require("../polls/voting");
const { getPollForNotify, markCompletedNotified } = require("../polls/model");
const { notifyPollEvent } = require("../integrations/notify");

const router = Router();

async function maybeNotifyVote(poll, voterName, chosen) {
  const updated = await getPollBySlug(poll.slug);
  const fullPoll = await getPollForNotify(poll.id);

  if (fullPoll?.discord_webhook_url || fullPoll?.slack_webhook_url) {
    const selected = fullPoll.options.filter((o) => chosen.includes(o.id));
    notifyPollEvent(fullPoll, "vote", {
      // Skjulte navne må heller ikke lækkes i kanal-notifikationer;
      // integrationen falder tilbage til "A participant".
      voterName: fullPoll.hide_voter_names ? null : voterName,
      options: selected,
    }).catch((err) => console.error("Notification failed:", err.message));

    if (
      fullPoll.expected_responses &&
      !fullPoll.completed_notified &&
      updated.response_count >= fullPoll.expected_responses
    ) {
      await markCompletedNotified(poll.id);
      notifyPollEvent(fullPoll, "completed", {
        expected: fullPoll.expected_responses,
      }).catch((err) => console.error("Notification failed:", err.message));
    }
  }

  return updated;
}

router.get("/:slug", async (req, res) => {
  try {
    const poll = await getPollBySlug(req.params.slug);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    let myResponses = {};
    const voterName = String(req.query.voterName || "").trim();

    if (poll.require_login) {
      if (req.session?.userId) {
        myResponses = await getUserVotes(poll.id, req.session.userId);
      }
    } else if (voterName) {
      myResponses = await getAnonymousVotes(poll.id, voterName);
    }

    const anonymousVoters =
      poll.require_login || poll.hide_voter_names ? [] : await getAnonymousVoterNames(poll.id);

    res.json({ poll, myResponses, anonymousVoters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:slug/vote", async (req, res) => {
  try {
    const poll = await getPollBySlug(req.params.slug);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    if (poll.locked_option_id) {
      return res.status(400).json({ error: "This poll is locked — no new responses are accepted." });
    }

    const { responses, voterName } = req.body;
    let result;

    if (poll.require_login) {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Login required to vote" });
      }

      result = await submitAuthenticatedVote({
        pollId: poll.id,
        userId: req.session.userId,
        voterName: req.session.user?.displayName || "Participant",
        responses,
      });
    } else {
      result = await submitAnonymousVote({
        pollId: poll.id,
        voterName,
        responses,
      });
    }

    const updated = await maybeNotifyVote(poll, result.voterName, result.chosen);
    const anonymousVoters =
      poll.require_login || poll.hide_voter_names ? [] : await getAnonymousVoterNames(poll.id);

    res.json({ poll: updated, myResponses: result.responses, anonymousVoters });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
