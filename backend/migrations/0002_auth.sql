-- Authentication indexes.
-- password_hash is already created by 0001_social.sql.
CREATE INDEX IF NOT EXISTS idx_users_email ON USERS(email);
