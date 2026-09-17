-- FUTUROLOGIO™: suporte a respostas encadeadas em comentários
ALTER TABLE COMMENTS ADD COLUMN parent_id INTEGER;
CREATE INDEX IF NOT EXISTS idx_comments_parent ON COMMENTS(parent_id, created_at ASC);
