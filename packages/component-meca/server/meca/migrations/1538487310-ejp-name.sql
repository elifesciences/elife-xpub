CREATE TABLE ejp_name (
  id    INTEGER PRIMARY KEY,
  first TEXT,
  last  TEXT
);
CREATE INDEX ejp_name_concat ON ejp_name (lower(first || ' ' || last));