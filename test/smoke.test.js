import replay from 'replay'
import { Selector } from 'testcafe'
import { addUser } from '@pubsweet/db-manager'
import { startServer, setup, teardown } from './helpers/setup'
import { dashboard } from './pageObjects'

replay.fixtures = `${__dirname}/http-mocks`

const admin = {
  username: 'tester',
  email: 'tester@example.com',
  password: 'password',
  admin: true,
}

fixture('Smoke test')
  .before(startServer)
  .beforeEach(async () => {
    await setup()
    await addUser(admin)
  })
  .afterEach(teardown)

test('Submission journey', async t => {
  await t.navigateTo(dashboard.url)

  // check that React root element exists
  await t.expect(Selector('#root').exists).ok()
})
