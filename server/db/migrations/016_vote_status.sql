-- Deltagere kan nu svare "ja", "måske" eller "nej" til en dato,
-- i stedet for kun at markere "ja" ved at vælge datoen.
ALTER TABLE votes ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'yes';
ALTER TABLE votes ADD CONSTRAINT votes_status_check CHECK (status IN ('yes', 'maybe', 'no'));
