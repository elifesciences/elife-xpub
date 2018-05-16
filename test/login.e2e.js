import { ClientFunction } from 'testcafe'

import { dashboard } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'
import mockOrcid from './helpers/mock-orcid'
import { setup } from './helpers/setup'

const f = fixture('Submission')
setFixtureHooks(f)

const getTokenFromLocalStorage = ClientFunction(() =>
  localStorage.getItem('token'),
)

test.before(async t => {
  await setup(t)
  return mockOrcid()
})('Login successful', async t => {
  await t.navigateTo(dashboard.url).click('[href="/auth/orcid"]')

  await t.expect(getTokenFromLocalStorage()).typeOf('string')
})
