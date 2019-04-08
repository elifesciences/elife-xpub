import { setup, teardown } from './setup'

export default chosenFixture =>
  chosenFixture.beforeEach(setup).afterEach(teardown)
