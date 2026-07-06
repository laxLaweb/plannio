-- Use email (not a separate username) as the identifier for password login
DROP INDEX IF EXISTS idx_users_username;
ALTER TABLE users DROP COLUMN IF EXISTS username;
