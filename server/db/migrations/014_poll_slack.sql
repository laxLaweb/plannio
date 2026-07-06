-- Slack webhook integration per poll (mirrors discord_* columns), created via
-- OAuth incoming-webhook flow.
ALTER TABLE polls ADD COLUMN IF NOT EXISTS slack_webhook_url TEXT;
ALTER TABLE polls ADD COLUMN IF NOT EXISTS slack_channel_name TEXT;
ALTER TABLE polls ADD COLUMN IF NOT EXISTS slack_team_id TEXT;
ALTER TABLE polls ADD COLUMN IF NOT EXISTS slack_events TEXT[] NOT NULL DEFAULT '{}';
