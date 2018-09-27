ALTER TABLE manuscript
  ADD COLUMN cover_letter TEXT,
  ADD COLUMN previously_discussed TEXT,
  ADD COLUMN previously_submitted TEXT [],
  ADD COLUMN cosubmission TEXT [],
  ADD COLUMN opposed_senior_editors_reason TEXT,
  ADD COLUMN opposed_reviewing_editors_reason TEXT,
  ADD COLUMN opposed_reviewers JSONB [],
  ADD COLUMN suggestions_conflict BOOLEAN,
  ADD COLUMN related_manuscripts JSONB [],
  ADD COLUMN submitter_signature TEXT,
  ADD COLUMN disclosure_consent BOOLEAN,
  ADD COLUMN qc_issues JSONB [];
