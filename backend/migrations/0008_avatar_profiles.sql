-- Persistent FUTUROLOGIO™ avatar configuration.
-- Sex is selected before customization and remains part of the avatar DNA.
CREATE TABLE IF NOT EXISTS AVATAR_PROFILES (
  user_id TEXT PRIMARY KEY,
  sex TEXT NOT NULL CHECK (sex IN ('masculino','feminino')),
  config TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);
