CREATE TABLE organization (
    id UUID PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated TIMESTAMP WITH TIME ZONE,
    name TEXT NOT NULL
);

CREATE TABLE journal (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organization,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated TIMESTAMP WITH TIME ZONE,
    journal_title TEXT NOT NULL,
    "meta,publisher_name" TEXT
);

CREATE TABLE manuscript (
    id UUID PRIMARY KEY,
    journal_id UUID NOT NULL REFERENCES journal,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated TIMESTAMP WITH TIME ZONE,
    -- points to "previous" (i.e. older) version of manuscript
    -- first version has previous_version = null
    -- id of current version does not change
    created_by TEXT NOT NULL,
    previous_version UUID REFERENCES manuscript,
    status TEXT NOT NULL,
    form_state TEXT,
    decision TEXT,
    "meta,title" TEXT,
    "meta,article_type" TEXT,
    "meta,article_ids" JSONB[],
    "meta,abstract" TEXT,
    "meta,subjects" TEXT[],
    "meta,publication_dates" JSONB[],
    "meta,notes" JSONB[]
);

CREATE TABLE file (
    id UUID PRIMARY KEY,
    manuscript_id UUID NOT NULL REFERENCES manuscript,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated TIMESTAMP WITH TIME ZONE,
    type TEXT,
    label TEXT,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    mime_type TEXT,
    size INTEGER
);

-- user is a reserved word so table name must always be quoted
CREATE TABLE "user" (
    id UUID PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated TIMESTAMP WITH TIME ZONE,
    default_identity TEXT
);

CREATE TABLE review (
    id UUID PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated TIMESTAMP WITH TIME ZONE,
    comments JSONB[],
    recommendation TEXT,
    open BOOLEAN,
    user_id UUID NOT NULL REFERENCES "user"
);

CREATE TABLE audit_log (
    id UUID PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    user_id UUID REFERENCES "user",
    action TEXT NOT NULL,
    object_id UUID,
    object_type TEXT
);

CREATE TABLE team (
    id UUID PRIMARY KEY,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated TIMESTAMP WITH TIME ZONE,
    team_members JSONB[] NOT NULL,
    role TEXT NOT NULL,
    object_id UUID NOT NULL,
    object_type TEXT NOT NULL
);

CREATE TABLE identity (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES "user",
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated TIMESTAMP WITH TIME ZONE,
    type TEXT NOT NULL, -- e.g. local, orcid
    identifier TEXT, -- e.g. orcid ID
    display_name TEXT, -- used in the UI
    email TEXT, -- used for contacting user
    meta JSONB -- anything else, e.g. password, oauth tokens
);