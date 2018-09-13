ALTER TABLE manuscript
  ADD COLUMN opposed_reviewers_reason TEXT,
  DROP COLUMN opposed_reviewers;
