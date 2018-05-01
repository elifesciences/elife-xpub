import { ClientFunction } from 'testcafe'
import { addUser } from '@pubsweet/db-manager'
import authentication from 'pubsweet-server/src/authentication'
import { startServer, setup, teardown } from './setup'

const admin = {
  username: 'tester',
  email: 'tester@example.com',
  password: 'password',
  orcid: '0000-0001',
  admin: true,
}

export default chosenFixture =>
  chosenFixture
    .before(startServer)
    .beforeEach(async t => {
      await setup()
      const user = await addUser(admin)
      t.ctx.token = authentication.token.create(user)
      t.ctx.localStorageSet = ClientFunction(token =>
        localStorage.setItem('token', token),
      )
    })
    .afterEach(teardown)
