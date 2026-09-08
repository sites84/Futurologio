-- Each invention may belong to only one creator.
CREATE TABLE IF NOT EXISTS INVENTION_OWNERS (
  invention_id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invention_id) REFERENCES INVENTIONS(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_invention_owners_user ON INVENTION_OWNERS(user_id, created_at DESC);

-- Preserve the earliest recorded creator when legacy data has the same invention
-- associated with more than one user.
INSERT OR IGNORE INTO INVENTION_OWNERS(invention_id,user_id,created_at)
SELECT invention_id,user_id,created_at
FROM (
  SELECT invention_id,user_id,created_at,
         ROW_NUMBER() OVER (PARTITION BY invention_id ORDER BY created_at ASC, user_id ASC) AS rn
  FROM USER_INVENTIONS
)
WHERE rn=1;
