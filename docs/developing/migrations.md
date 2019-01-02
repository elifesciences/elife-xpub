# Database Migrations

Database migrations are used to setup and make changes to the database. They get run automatically on our environments, but they have to be run manually when developing locally.

To run migrations, use the following command:

```
npx pubsweet migrate
```

### Making a database change

Migrations are kept within `server/xpub-model/migration`. To add a new migration, add a `.sql` file to the folder.

Migrations are run sequentially, and are based on the file name. To create a new migration, run the following command:

```
touch server/xpub-model/migrations/`date +%s`-migration.sql
```

Once a migration has been run on a database, a record is kept within the database itself within a `migrations` table. This ensures that the migration is not run multiple times.

**Note: any changes made to an existing migration file will not be picked up when migrations are run** 
