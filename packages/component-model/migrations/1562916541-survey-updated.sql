ALTER TABLE survey_response 
    RENAME COLUMN submission_id TO manuscript_id;
ALTER TABLE survey_response 
    ADD COLUMN updated TIMESTAMP WITH TIME ZONE;
ALTER TABLE survey_repsonse
  ALTER COLUMN survey_id VARCHAR(255)