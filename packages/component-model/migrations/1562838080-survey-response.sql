CREATE TABLE survey_response (
  response_id UUID PRIMARY KEY,
  submission_id UUID NOT NULL,
  response JSONB NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);
