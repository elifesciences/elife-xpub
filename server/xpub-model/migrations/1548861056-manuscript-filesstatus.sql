-- Pubsweet does not handle dropping types
-- So handle the expcetion if it exists 
-- (don't explicitly drop it as it might still be in use on the table)

CREATE TYPE FILESTATUS AS ENUM
        ( 'READY', 'CHANGING' );

ALTER TABLE manuscript 
    ADD COLUMN filestatus FILESTATUS;

ALTER TABLE manuscript ALTER COLUMN filestatus
    SET DEFAULT 'READY';
