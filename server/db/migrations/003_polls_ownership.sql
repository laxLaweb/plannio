-- Poll ownership + fleksible tidspunkter (dato/tid/hele dagen)

ALTER TABLE polls ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_polls_user_id ON polls(user_id);

ALTER TABLE poll_options ADD COLUMN IF NOT EXISTS option_date DATE;
ALTER TABLE poll_options ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE poll_options ADD COLUMN IF NOT EXISTS all_day BOOLEAN NOT NULL DEFAULT false;

-- starts_at var oprindeligt NOT NULL; nye polls bruger option_date/start_time i stedet
ALTER TABLE poll_options ALTER COLUMN starts_at DROP NOT NULL;
