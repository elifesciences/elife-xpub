CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER TABLE "audit_log" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "entities" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "file" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "identity" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "journal" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "manuscript" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "migrations" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "organization" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "review" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "semantic_extraction" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "team" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

