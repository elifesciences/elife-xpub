-- Pubsweet does not handle droping types
-- So handle the expcetion if it exists 
-- (don't explicitly drop it as it might still be in use on the table)
DO $$ BEGIN
    CREATE TYPE filestatus AS ENUM
        ( 'CREATED', 'UPLOADING', 'UPLOADED', 'CANCELLED' );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE file 
    ADD COLUMN status filestatus;

ALTER TABLE file ALTER COLUMN status
    SET DEFAULT 'CREATED';
