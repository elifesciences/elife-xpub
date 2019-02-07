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
       * [Dev Ops](#dev-ops)


# Deployment steps
## How do you deploy to production?
See the docs [here](https://github.com/elifesciences/elife-xpub/blob/develop/docs/deploying/environments.md#jenkins)
## How do you see what’s deployed in production?
You can see the latest build to production [here](https://alfred.elifesciences.org/job/prod-elife-xpub/lastSuccessfulBuild/). You can also find the commit hash within the `<head>` tags of the page, which can be done for every environment.


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
We use NewRelic to monitor the application. You can request access from the [Head of Engineering](#head-of-engineering)
## How do I view logs?
You can view logs by using Builder, SSHing into the application servers, or by using Logly.
## How do I access the application servers?
[Follow these instructions](https://github.com/elifesciences/bastion-formula) to access the bastion. You can then access the application servers with the following command, _ssh environment--xpub--instance_, for example:
```
ssh prod--xpub--1
```
## How do I access the database?
See the docs [here](https://github.com/elifesciences/elife-xpub/blob/develop/docs/deploying/database.md#access)
## How do I access EJP’s SFTP server?
You can request access from the [lead developer](#lead-developer)
## How do I find and investigate a submission
### Accessing the uploaded files on S3
### Viewing the submission on the database
### Viewing the audit log of a submission


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
g.sironi@elifesciences.org
