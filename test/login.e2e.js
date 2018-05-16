import { ClientFunction } from 'testcafe'

import { dashboard } from './pageObjects'
import authenticateFixture from './helpers/authenticate-fixture'
import mockOrcid from './helpers/mock-orcid'

const f = fixture('Submission')
authenticateFixture(f)

const getTokenFromLocalStorage = ClientFunction(() =>
  localStorage.getItem('token'),
)

test.before(mockOrcid)('Login successful', async t => {
  await t.navigateTo(dashboard.url).click('[href="/auth/orcid"]')

  await t.expect(getTokenFromLocalStorage()).typeOf('string')
})
