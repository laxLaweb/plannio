-- Understøt sluttidspunkt (fra-til tid)

ALTER TABLE poll_options ADD COLUMN IF NOT EXISTS end_time TIME;
