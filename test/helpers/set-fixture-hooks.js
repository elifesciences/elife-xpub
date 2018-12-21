import { startServer, setup, teardown, stopServer } from './setup'

export default chosenFixture =>
  chosenFixture
    .before(startServer)
    .beforeEach(setup)
    .afterEach(teardown)
    .after(stopServer)
