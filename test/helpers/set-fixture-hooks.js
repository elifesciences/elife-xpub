import { startServer, setup, teardown } from './setup'

const f = fixture('Application')
f
  .before(startServer)
  .beforeEach(setup)
  .afterEach(teardown)

// TODO: remove
export default chosenFixture =>
  chosenFixture

