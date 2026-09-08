-- Remove legacy duplicate ownership mappings. The first recorded owner remains the canonical creator.
DELETE FROM USER_INVENTIONS
WHERE rowid IN (
  SELECT ui.rowid
  FROM USER_INVENTIONS ui
  JOIN INVENTION_OWNERS io ON io.invention_id=ui.invention_id
  WHERE ui.user_id<>io.user_id
);
