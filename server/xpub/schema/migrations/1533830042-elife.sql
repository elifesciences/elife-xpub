ALTER TABLE manuscript
  ADD COLUMN previously_discussed TEXT,
  ADD COLUMN previously_submitted JSONB,
  ADD COLUMN cosubmission JSONB,
  ADD COLUMN related_manuscripts JSONB,
  ADD COLUMN suggestions_conflict BOOLEAN,
  ADD COLUMN submitter_signature TEXT,
  ADD COLUMN disclosure_consent BOOLEAN,
  ADD COLUMN qc_issues JSONB;
