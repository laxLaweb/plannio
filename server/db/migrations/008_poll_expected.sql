-- Forventet antal udfyldte + flag for "alle har svaret"-notifikation

ALTER TABLE polls ADD COLUMN IF NOT EXISTS expected_responses INTEGER;
ALTER TABLE polls ADD COLUMN IF NOT EXISTS completed_notified BOOLEAN NOT NULL DEFAULT false;
