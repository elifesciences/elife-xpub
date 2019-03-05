ALTER TYPE auditaction RENAME TO auditaction_old;
CREATE TYPE auditaction AS ENUM( 'CREATED', 'UPDATED', 'DELETED', 'MECA_RESULT' );
ALTER TABLE audit_log ALTER COLUMN action TYPE auditaction USING action::text::auditaction;
DROP TYPE auditaction_old;