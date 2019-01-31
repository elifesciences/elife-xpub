-- Pubsweet does not handle dropping types
-- So handle the expcetion if it exists 
-- (don't explicitly drop it as it might still be in use on the table)
DO $$ BEGIN
    CREATE TYPE file_status_types AS ENUM
            ( 'READY', 'CHANGING' );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE manuscript 
    ADD COLUMN file_status file_status_types;

ALTER TABLE manuscript ALTER COLUMN file_status
    SET DEFAULT 'READY';
