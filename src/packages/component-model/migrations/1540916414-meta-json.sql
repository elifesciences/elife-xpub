ALTER TABLE manuscript
  ADD COLUMN meta JSONB,
  DROP COLUMN "meta,title",
  DROP COLUMN "meta,article_type",
  DROP COLUMN "meta,article_ids",
  DROP COLUMN "meta,abstract",
  DROP COLUMN "meta,subjects",
  DROP COLUMN "meta,publication_dates",
  DROP COLUMN "meta,notes";