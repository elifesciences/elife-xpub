CREATE TABLE survey (
    id UUID PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated TIMESTAMP WITH TIME ZONE,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE survey_response (
    id UUID PRIMARY KEY,
    survey_id UUID NOT NULL REFERENCES survey,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated TIMESTAMP WITH TIME ZONE,
    response JSONB[]
);
