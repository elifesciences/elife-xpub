import config from 'config'
import { ClientFunction } from 'testcafe'
import startSshServer from '@elifesciences/xpub-meca-export/test/mock-sftp-server'
import { submissionStatus } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'
import NavigationHelper from './helpers/navigationHelper'

const f = fixture('Test the route SubmissionStatus')
setFixtureHooks(f)

const getLocation = ClientFunction(() => document.location.href)

test('Been able to see the page', async t => {
  const { server } = await startSshServer(
    config.get('meca.sftp.connectionOptions.port'),
  )

  const navigationHelper = new NavigationHelper(t)

  navigationHelper.login()
  await t.navigateTo('submissions/bdcd04a4-f065-48fd-b0a3-dce8eb5f4973')
  await t.wait(5000)

  await t
    .expect(submissionStatus.welcomeMessage.textContent)
    .eql('we are in the status page.')

  await new Promise((resolve, reject) =>
    server.close(err => (err ? reject(err) : resolve())),
  )
})

test('Should fail if the user is not authenticated', async t => {
  const { server } = await startSshServer(
    config.get('meca.sftp.connectionOptions.port'),
  )

  await t.navigateTo(submissionStatus.loginUrl)
  await t.navigateTo('submissions/bdcd04a4-f065-48fd-b0a3-dce8eb5f4973')
  await t.expect(getLocation()).contains(submissionStatus.loginUrl)

  await new Promise((resolve, reject) =>
    server.close(err => (err ? reject(err) : resolve())),
  )
})
