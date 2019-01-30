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

## Backup and restore

RDS snapshots are taken daily and [retained for 4 weeks in `prod`](https://github.com/elifesciences/builder/blob/master/projects/elife.yaml#L1970).

The scripts `dump-database.sh` and `restore-database.sh` are available on the PATH, and can be used respectively to perform a new dump from any Postgres host and to restore that dump. You can execute them from any folder, and it is advised to target `/ext/tmp` for dumps as it provides plenty of space.

### Restoring from an RDS snapshot

#### 1. Identify the snapshot you want to restore

```
$ aws rds describe-db-snapshots --db-instance-identifier elife-xpub-staging --no-paginate | jq -r .DBSnapshots[].DBSnapshotIdentifier
rds:elife-xpub-staging-2019-01-26-03-30
rds:elife-xpub-staging-2019-01-27-03-30
rds:elife-xpub-staging-2019-01-28-03-30
rds:elife-xpub-staging-2019-01-29-03-30
```

The format of the date in the snapshot name is `YYYY-mm-dd-HH-MM`.

#### 2. Get the subnet group and security group of the existing database instance

```
$ aws rds describe-db-instances --db-instance-identifier=elife-xpub-staging | jq .DBInstances[0]
[
    "DBSubnetGroup": {
        "DBSubnetGroupName": "elife-xpub-staging-attacheddbsubnet-htu8tybjp0f4",
        ...
    },
    "VpcSecurityGroups": {
        "VpcSecurityGroupId": "sg-013a86123118c6cc8",
        "Status": "active"
    },
    ...
]
```

The RDS instance that will be created from the snapshot has to use the same subnet and security group, so that it is accessible from the `elife-xpub` servers of that environment.

#### 3. Create a new RDS instance from the snapshot, in the correct subnet group

```
$ aws rds restore-db-instance-from-db-snapshot --db-instance-identifier elife-xpub-staging-restore --db-snapshot-identifier rds:elife-xpub-staging-2019-01-29-03-30 --db-instance-class db.t2.small  --db-subnet-group-name elife-xpub-staging-attacheddbsubnet-htu8tybjp0f4
```

Wait for the instance to become available:

```
$ aws rds describe-db-instances --db-instance-identifier elife-xpub-staging | jq -r .DBInstances[0].DBInstanceStatus
available
```

#### 4. Modify the instance with the correct security group

```
$ aws rds modify-db-instance --db-instance-identifier elife-xpub-staging-restore --vpc-security-group-ids sg-013a86123118c6cc8
{
	"DBInstance": {
        "Endpoint": {
            "Port": 5432,
            "Address": "elife-xpub-staging-restore.cxyopn44uqbl.us-east-1.rds.amazonaws.com",
            "HostedZoneId": "Z2R2ITUGPM61AM"
        },
		...
}
```

#### 5. Dump the new node

As the prompt shows, you have to do this from node 1 of an `elife-xpub` cluster, which is allowed to access the database nodes and has the necessary scripts deployed.

```
elife@staging--xpub:~$ dump-database.sh /ext/tmp/dump-afternoon elife-xpub-staging-restore.cxyopn44uqbl.us-east-1.rds.amazonaws.com
```

The `PGHOST` being used here is the RDS node that has just been created (2nd argument).

#### 6. Restore the dump on the existing node

```
 ./restore-database.sh /ext/tmp/dump-afternoon elife-xpub-staging.cxyopn44uqbl.us-east-1.rds.amazonaws.com
```

The `PGHOST` being used here is the existing RDS node for this environment (2nd argument).

#### 7. Remove the new node

Don't worry about this: when the emergency has been addressed, ask your administrator to clean up the temporary RDS node and its own snapshots.
