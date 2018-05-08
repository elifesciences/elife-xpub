import { ClientFunction } from 'testcafe'

import { dashboard } from './pageObjects'
import authenticateFixture from './helpers/authenticate-fixture'

const f = fixture('Submission')
authenticateFixture(f)

const sandboxLogin = {
  username: 'elife@mailinator.com',
  password: 'Password1',
}

const getTokenFromLocalStorage = ClientFunction(() =>
  localStorage.getItem('token'),
)

test('Login successful', async t => {
  await t
    .navigateTo(dashboard.url)
    .click('[href="/auth/orcid"]')
    .typeText('[id=userId]', sandboxLogin.username)
    .typeText('[id=password]', sandboxLogin.password)
    .click('[id=form-sign-in-button]')

  await t.expect(getTokenFromLocalStorage()).typeOf('string')
})
