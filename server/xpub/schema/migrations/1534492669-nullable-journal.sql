-- temporarily allow journal ID to be NULL
ALTER TABLE manuscript 
  ALTER COLUMN journal_id DROP NOT NULL;