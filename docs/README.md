# eLife xPub documentation

## Requirements

- Node >= 8.0
- Yarn
- PostgreSQL >= 9.6

## Initial setup

- Clone this repo
- Run `yarn` to install dependencies
  - Note this project is a monorepo using [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)
- Configure the app
  - Create a `config/local-development.js` file
    - This should export an empty (for now) object
    - Use it to hold any configuration that should not be checked into source control
    - Refer to `config/default.js` for a list of possible config keys
  - Add database configuration if necessary
    - In most cases the defaults should work without additional configuration
  - Add ORCID OAuth client ID and secret
    - Either get these from another team member or [apply for new ones](https://orcid.org/content/register-client-application-sandbox)
- Start the app with `npm run server`
  - Visit <http://localhost:3000>
  - Follow the links to sign up for an account on the Orcid sandbox server
