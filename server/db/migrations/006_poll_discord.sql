-- Discord webhook-integration pr. poll (oprettet via OAuth webhook.incoming)

ALTER TABLE polls ADD COLUMN IF NOT EXISTS discord_webhook_url TEXT;
ALTER TABLE polls ADD COLUMN IF NOT EXISTS discord_webhook_id TEXT;
ALTER TABLE polls ADD COLUMN IF NOT EXISTS discord_channel_id TEXT;
ALTER TABLE polls ADD COLUMN IF NOT EXISTS discord_guild_id TEXT;
ALTER TABLE polls ADD COLUMN IF NOT EXISTS discord_events TEXT[] NOT NULL DEFAULT '{}';
