-- Pubsweet does not handle dropping types
-- So handle the expcetion if it exists
-- (don't explicitly drop it as it might still be in use on the table)
DO $$ BEGIN
    CREATE TYPE auditaction AS ENUM
        ( 'CREATED', 'UPDATED', 'DELETED' );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE audit_log
    ADD COLUMN value TEXT;

ALTER TABLE audit_log
    DROP COLUMN action,
    ADD COLUMN action auditaction;
