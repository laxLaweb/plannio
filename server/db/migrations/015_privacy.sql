-- GDPR: dataminimering og privatliv
-- 1) votes.voter_email var en unødvendig kopi af brugerens email (stemmer er
--    allerede knyttet via user_id) og fjernes.
-- 2) hide_voter_names lader poll-ejeren skjule deltagernavne for andre deltagere.

DROP INDEX IF EXISTS idx_votes_option_email;
ALTER TABLE votes DROP COLUMN IF EXISTS voter_email;

ALTER TABLE polls ADD COLUMN IF NOT EXISTS hide_voter_names BOOLEAN NOT NULL DEFAULT false;
