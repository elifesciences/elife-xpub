CREATE TABLE semantic_extraction (
    id UUID PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    manuscript_id UUID NOT NULL REFERENCES manuscript,
    field_name TEXT,
    value TEXT
);