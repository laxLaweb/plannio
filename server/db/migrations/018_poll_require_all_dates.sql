-- Poll-ejeren kan kræve at deltagere svarer på ALLE datoer (accepted/maybe/can't make it),
-- i stedet for kun at vælge de datoer de kan.
ALTER TABLE polls ADD COLUMN IF NOT EXISTS require_all_dates BOOLEAN NOT NULL DEFAULT true;
