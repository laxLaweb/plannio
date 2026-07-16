-- Poll-ejeren kan vælge om deltagere også må svare "måske" på en dato.
ALTER TABLE polls ADD COLUMN IF NOT EXISTS allow_maybe BOOLEAN NOT NULL DEFAULT true;
