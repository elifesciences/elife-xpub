import { startServer, setup, teardown } from './setup'

export default chosenFixture =>
  chosenFixture
    .before(startServer)
    .beforeEach(setup)
    .afterEach(teardown)
