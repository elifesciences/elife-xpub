ALTER TABLE survey_response 
    RENAME COLUMN submission_id TO manuscript_id;
ALTER TABLE survey_response 
    ADD COLUMN updated TIMESTAMP WITH TIME ZONE;
ALTER TABLE survey_response
  ALTER COLUMN survey_id TYPE VARCHAR(255);