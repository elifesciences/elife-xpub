# Quick Start

## Introduction

This file explains how to get up and running with `elife-xpub`. However as this is based on PubSweet you may wish to refer to these instructions to help getting running locally:

[PubSweet development setup](https://gitlab.coko.foundation/pubsweet/pubsweet/wikis/Development:-setup)

Otherwise the instructions below should be sufficient to get started quickly.

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
    - To run postgres within a docker container use the command `docker-compose up -d postgres`
- Start the app with `npm run server`
  - Visit <http://localhost:3000>

## Other Dependencies

### Sciencebeam

The application should work fine with the defaults for sciencebeam - refering to the online service at sciencebeam-texture.elifesciences.org

However, you can run the docker containers for sciencebeam locally. This is done by cloning the repo at https://github.com/elifesciences/sciencebeam and running: `docker-compose up`
