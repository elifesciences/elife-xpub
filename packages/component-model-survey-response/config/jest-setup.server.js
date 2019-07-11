const { db } = require('@pubsweet/db-manager')
const replaySetup = require('../../../test/helpers/replay-setup')

replaySetup('success')

// The pipeline complains at the default of 5s - so double it!
// https://jestjs.io/docs/en/jest-object#jestsettimeouttimeout
jest.setTimeout(10000)

afterAll(() => db.destroy())
