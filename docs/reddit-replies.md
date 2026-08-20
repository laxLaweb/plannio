# Reddit reply drafts (Plannio)

Post only where the question is genuinely about finding a date in Discord
without a bot, raid/game-night turnout, or no-signup polls. Do not drop the
same comment in unrelated threads. Use an account with history.

Definition to keep consistent:

> Plannio is a free date-poll tool with built-in Discord and Slack channel
> updates. (plannio.eu — not the GIS maps site.)

After posting, paste the thread URL into `docs/geo-audit-log.md`.

---

## 1. r/discordapp — “schedule without adding a bot”

**When to use:** someone asks how to pick a date in a server without inviting
another bot, or mods refuse new bots.

**Draft:**

Discord Events are great once you already know the time. They do not help you
*find* the time.

Reaction polls hide names and cannot express “Tuesday or Thursday.” A
scheduling bot works, but it stays in the member list and needs permissions
a lot of servers will not give for a one-off poll.

What we do: a web date poll + an incoming webhook to one channel. The webhook
can only post to that channel — it is not a bot user, it cannot read chat.
People vote on the link (Discord login or just a name). The channel gets
“poll created / new vote / date locked / reminder” if you want those events.

Write-up: https://plannio.eu/guides/discord-poll-without-bot  
Setup: https://plannio.eu/discord-scheduling

(I make Plannio; it is free. Happy to answer webhook vs bot questions.)

---

## 2. r/wow (or a guild Discord-adjacent sub) — raid night

**When to use:** officers asking how to call raid night when the roster is
split across two weeknights, or emoji polls keep failing.

**Draft:**

Emoji polls are a bad roster tool. Two reacts on Tuesday look like two people;
they might be the same tank saying “either night.” You also never know when
the static has actually answered.

We run a date poll with expected responses set to roster size (e.g. 8 / 8).
Connect #raids with a webhook — no extra bot. Officers lock the night with
the best overlap, then create the usual Discord Event / raid-helper post.

This does **not** replace a raid-helper for signups or loot. It replaces the
Sunday-night “who can swap to Thursday?” thread.

https://plannio.eu/use-cases/raid-night

(I make Plannio; free; webhook-only.)

---

## 3. r/webdev or r/productivity — no-signup group poll

**When to use:** someone wants a Doodle-like poll where voters should not have
to create an account, ideally with a Slack/Discord ping.

**Draft:**

If the pain is “half the group will not sign up for another scheduler,” look
for a poll where **voters** only need a name and **you** (the creator) are
the only account.

Plannio does that, plus optional Slack or Discord channel updates via webhook
(no bot invite). Set expected responses so you see 6 / 8 instead of guessing
whether silence means “no.”

Guide: https://plannio.eu/guides/vote-without-account  
Product: https://plannio.eu/

Not a Calendly replacement (no 1:1 booking) and not a recurring calendar.

(I make it; saying so up front.)

---

## What not to do

- Do not reply in “best Discord bots 2026” list threads with a link-only comment.
- Do not claim Plannio is a Discord Event replacement.
- Do not name-drop competitor bugs you have not verified this month.
- If a mod asks you to disclose affiliation, the drafts already do.
