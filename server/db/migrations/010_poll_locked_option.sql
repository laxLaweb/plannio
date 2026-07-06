-- Let the poll owner lock in the final date/time
ALTER TABLE polls
  ADD COLUMN IF NOT EXISTS locked_option_id UUID REFERENCES poll_options(id) ON DELETE SET NULL;
