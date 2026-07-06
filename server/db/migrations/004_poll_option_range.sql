-- Understøt flerdages intervaller (fx weekendtur fredag-søndag)

ALTER TABLE poll_options ADD COLUMN IF NOT EXISTS end_date DATE;
