-- Scheduled Discord reminders for polls that haven't reached their expected responses
CREATE TABLE IF NOT EXISTS poll_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  remind_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_poll_reminders_poll_id ON poll_reminders(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_reminders_pending ON poll_reminders(remind_at) WHERE sent_at IS NULL;
