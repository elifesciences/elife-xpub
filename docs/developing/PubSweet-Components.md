# PubSweet Components

| Component                          | Reason                                                                      |
| ---------------------------------- | --------------------------------------------------------------------------- |
| @pubsweet/db-manager               | Access to the database for tests to add users and create tables (for setup) |
| @pubsweet/logger                   | Logging (mainly tests)                                                      |
| pubsweet-server                    | Starting the service.                                                       |
| pubsweet-server/src/authentication | Using ORCiD authentication                                                  |
| pubsweet-server/src/db             | Ability to directly query the database.                                     |
| pubsweet-server/src/models/Model   | To use `selectorToSql()`                                                    |
| pubsweet-server/src/models/User    | To query the User object.                                                   |
