# Support

   * [Deployment steps](#deployment-steps)
      * [How do you deploy to production?](#how-do-you-deploy-to-production)
      * [How do you see what’s deployed in production?](#how-do-you-see-whats-deployed-in-production)
   * [Migration steps](#migration-steps)
      * [How do you add a migration?](#how-do-you-add-a-migration)
      * [How do you rollback a migration?](#how-do-you-rollback-a-migration)
   * [Database restore and backup](#database-restore-and-backup)
      * [How do you do backups? Are they automated?](#how-do-you-do-backups-are-they-automated)
      * [How do you restore the database?](#how-do-you-restore-the-database)
   * [Support tools and processes](#support-tools-and-processes)
      * [How do I monitor errors, response times and traffic?](#how-do-i-monitor-errors-response-times-and-traffic)
      * [How do I view logs?](#how-do-i-view-logs)
      * [How do I access the application servers?](#how-do-i-access-the-application-servers)
      * [How do I access the database?](#how-do-i-access-the-database)
      * [How do I access EJP’s SFTP server?](#how-do-i-access-ejps-sftp-server)
      * [How do I find and investigate a submission](#how-do-i-find-and-investigate-a-submission)
         * [Accessing the uploaded files on S3](#accessing-the-uploaded-files-on-s3)
         * [Viewing the submission on the database](#viewing-the-submission-on-the-database)
         * [Viewing the audit log of a submission](#viewing-the-audit-log-of-a-submission)
   * [Contact details](#contact-details)
       * [EJP](#ejp)
       * [Product Owner](#product-owner)
       * [Head of Technology](#head-of-technology)
       * [Lead Developer](#lead-developer)
       * [Administrator](#administrator)


# Deployment steps
## How do you deploy to production?
See the docs [here](https://github.com/elifesciences/elife-xpub/blob/develop/docs/deploying/environments.md#jenkins)
## How do you see what’s deployed in production?
You can see the latest build to production [here](https://alfred.elifesciences.org/job/prod-elife-xpub/lastSuccessfulBuild/). 

You can also find the commit hash within the `<head>` tags of `elife-xpub` pages, which can be done on every environment.


# Migration steps
## How do you add a migration?
See the docs [here](https://github.com/elifesciences/elife-xpub/blob/develop/docs/developing/migrations.md)
## How do you rollback a migration?
See the docs [here](https://github.com/elifesciences/elife-xpub/blob/develop/docs/deploying/database.md#migrations)


# Database restore and backup
## How do you do backups? Are they automated?
See the docs [here](https://github.com/elifesciences/elife-xpub/blob/develop/docs/deploying/database.md#backup-and-restore)
## How do you restore the database?
See the docs [here](https://github.com/elifesciences/elife-xpub/blob/develop/docs/deploying/database.md#restoring-from-an-rds-snapshot)


# Support tools and processes
## How do I monitor errors, response times and traffic?
We use NewRelic to monitor the application. NewRelic is available for the following environments:
- Production: https://rpm.newrelic.com/accounts/1451451/applications/162983119
- Staging: https://rpm.newrelic.com/accounts/1707959/applications/162979288

You can request access from the [Administrator](#administrator) or the [Head of Technology](#head-of-technology).
## How do I view logs?
You can view logs by using one of the following methods:
1. You can view the logs directly within the [application servers](#how-do-i-access-the-application-servers). The logs can be found within the `/srv/elife-xpub/var/logs/` directory on the server.
2. Using [Logly](https://elifesciences.loggly.com/).
## How do I access the application servers?
To SSH into application servers, you will need to perform the following setup:
1. [Follow these instructions](https://github.com/elifesciences/bastion-formula) to access the bastion. From the bastion, you can easily SSH into other environments, once access has been granted.
2. Your public key does needs to be added to [elifesciences/builder-configuration](https://github.com/elifesciences/builder-configuration/blob/master/pillar/elife-public.sls#L67-L75). A build has to be run by the [Administrator](#administrator) to apply it to that particular environment. This allows you to access `elife-xpub` environments from either the bastion or directly.

You can then access the application servers with the following command, _ssh environment--xpub--instance_, for example:
```
ssh prod--xpub--1
```
## How do I access the database?
See the docs [here](https://github.com/elifesciences/elife-xpub/blob/develop/docs/deploying/database.md#access)
## How do I access EJP’s SFTP server?
The credentials for EJP's SFTP server can be found on the [application servers](#how-do-i-access-the-application-servers). The following environment variables will contain the credentials, which can be used by any SFTP client:
```
MECA_SFTP_PORT=22
MECA_SFTP_REMOTEPATH=
MECA_SFTP_HOST=...
MECA_SFTP_PASSWORD=...
MECA_SFTP_USERNAME=...
```

## How do I find and investigate a submission
### Accessing the uploaded files for submissions
Uploaded files are pushed to the following two locations:
- AWS S3, which can be found [here](https://512686554592.signin.aws.amazon.com/console). To gain access, contact the [administrator](#administrator).
- EJP's SFTP Server. To gain access, see the docs [here](#how-do-i-access-ejps-sftp-server).
### Viewing the submission on the database
Once you have the submission ID, the submission can be found on the `manuscript` table. You can use the following query to see the database entry for the submission:
`select * from manuscript where id='some-UUID';`
### Viewing the audit log of a submission
A submission can be updated by both the user and EJP. To track these changes, the database stores an audit log. You can view the audit log of a submission using the following query:
`select * from audit_log where object_type like 'manuscript%' and id='some-UUID';`

# Contact details
## Product Owner
Hannah Drury
h.drury@elifesciences.org
## Head of Technology
Paul Shannon
p.shannon@elifesciences.org
## Lead developer
Peter Hooper
p.hooper@elifesciences.org
## Administrator
Giorgio Sironi
it-admin@elifesciences.org
