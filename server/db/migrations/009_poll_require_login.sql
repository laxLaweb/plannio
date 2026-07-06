-- Valgfrit login-krav ved afstemning

ALTER TABLE polls ADD COLUMN IF NOT EXISTS require_login BOOLEAN NOT NULL DEFAULT true;

-- Unikt navn pr. option for anonyme stemmer
CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_option_anonymous_name
  ON votes (poll_option_id, lower(trim(voter_name)))
  WHERE user_id IS NULL AND voter_name IS NOT NULL;
