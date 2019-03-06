CREATE TABLE semantic_extraction (
    id UUID PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated TIMESTAMP WITH TIME ZONE,
    manuscript_id UUID NOT NULL,
    field_name TEXT NOT NULL,
    value TEXT NOT NULL
);