
CREATE TYPE filestatus AS ENUM
    ( 'CREATED', 'UPLOADING', 'UPLOADED', 'CANCELLED' );

ALTER TABLE file ADD COLUMN status filestatus;

