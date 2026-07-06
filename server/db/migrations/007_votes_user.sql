-- Knyt stemmer til brugere (login-baseret afstemning)

ALTER TABLE votes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- voter_name var oprindeligt NOT NULL; login-baserede stemmer bruger brugerens navn
ALTER TABLE votes ALTER COLUMN voter_name DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_option_user
  ON votes(poll_option_id, user_id)
  WHERE user_id IS NOT NULL;
