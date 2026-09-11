-- FUTUROLOGIO™ daily credit missions
CREATE TABLE IF NOT EXISTS DAILY_CREDIT_MISSIONS (
  user_id TEXT NOT NULL,
  mission_date TEXT NOT NULL,
  likes_rewarded INTEGER NOT NULL DEFAULT 0,
  comment_rewarded INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, mission_date),
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_daily_credit_missions_date ON DAILY_CREDIT_MISSIONS(mission_date);
