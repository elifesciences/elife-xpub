# Database

The project relies on a `postgres` database.

For local, `ci` and review environments this is provided by a `postgres` container colocated with the application.

For `end2end`, `staging` and `prod` this is provided by a RDS managed database, replicated in 2 availability zones where necessary.

## Access

RDS databases live in an internal subnet and can only be accessed from within a server in the eLife VPC. You can use the [`bastion`](https://github.com/elifesciences/bastion-formula) but it may be more practical to start from the related `elife-xpub` server running the application container.

RDS databases are created as empty and credentials are provided as environment variables:

```
PGHOST=elife-xpub-staging.cxyopn44uqbl.us-east-1.rds.amazonaws.com
PGPORT=5432
PGUSER=...
PGPASSWORD=...
PGDATABASE=elifexpubstaging
```

## Creation

The formula [creates a database schema automatically](https://github.com/elifesciences/elife-xpub-formula/blob/master/salt/elife-xpub/scripts/setup-database.sh) but only if tables are not already present. This should only happen on the first deploy to a new environment.

## Migrations

Migrations are [run automatically](https://github.com/elifesciences/elife-xpub-formula/blob/master/salt/elife-xpub/init.sls#L133) on each deploy.

Migrations have to be backward compatible as every deploy has a critical section where the old application code is still running after migrations have been applied.

There is no automated rollback of migrations.
