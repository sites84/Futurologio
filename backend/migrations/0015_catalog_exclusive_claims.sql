-- FUTUROLOGIO™: cada produto do catálogo pode ser criado uma única vez.
-- Mantém os dados legados e cria uma trava única por source_id.
CREATE TABLE IF NOT EXISTS CATALOG_CLAIMS (
  source_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  invention_id INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_catalog_claims_user ON CATALOG_CLAIMS(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_catalog_claims_invention ON CATALOG_CLAIMS(invention_id);

-- Recupera o primeiro criador conhecido para cada produto legado.
INSERT OR IGNORE INTO CATALOG_CLAIMS(source_id,user_id,invention_id,created_at)
SELECT source_id,user_id,invention_id,created_at
FROM (
  SELECT json_extract(i.data,'$.source_id') AS source_id,
         o.user_id,
         i.id AS invention_id,
         o.created_at,
         ROW_NUMBER() OVER (
           PARTITION BY json_extract(i.data,'$.source_id')
           ORDER BY o.created_at ASC, i.id ASC
         ) AS rn
  FROM INVENTIONS i
  JOIN INVENTION_OWNERS o ON o.invention_id=i.id
  WHERE json_extract(i.data,'$.source_id') IS NOT NULL
    AND TRIM(CAST(json_extract(i.data,'$.source_id') AS TEXT))<>''
) WHERE rn=1;

-- Fallback para registros antigos que tenham USER_INVENTIONS mas não tenham INVENTION_OWNERS.
INSERT OR IGNORE INTO CATALOG_CLAIMS(source_id,user_id,invention_id,created_at)
SELECT source_id,user_id,invention_id,created_at
FROM (
  SELECT json_extract(i.data,'$.source_id') AS source_id,
         ui.user_id,
         i.id AS invention_id,
         ui.created_at,
         ROW_NUMBER() OVER (
           PARTITION BY json_extract(i.data,'$.source_id')
           ORDER BY ui.created_at ASC, i.id ASC
         ) AS rn
  FROM INVENTIONS i
  JOIN USER_INVENTIONS ui ON ui.invention_id=i.id
  WHERE json_extract(i.data,'$.source_id') IS NOT NULL
    AND TRIM(CAST(json_extract(i.data,'$.source_id') AS TEXT))<>''
) WHERE rn=1;
