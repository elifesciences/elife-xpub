import { profile, files } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'
import NavigationHelper from './helpers/navigationHelper'

const f = fixture('MultiFile Upload')
setFixtureHooks(f)

const manuscript = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript-2.pdf',
  supportingFiles: [
    './fixtures/dummy-supporting-1.pdf',
    './fixtures/dummy-supporting-2.docx',
    './fixtures/dummy-supporting-2.docx',
    './fixtures/dummy-supporting-2.docx',
    './fixtures/dummy-supporting-2.docx',
    './fixtures/dummy-supporting-2.docx',
    './fixtures/dummy-supporting-2.docx',
    './fixtures/dummy-supporting-2.docx',
  ],
}

test('should display an error when files are still uploading', async t => {
  const navigationHelper = new NavigationHelper(t)

  navigationHelper.login()

  await t.expect(profile.name, { 'data-hj-suppress': '' }).ok()
  navigationHelper.newSubmission()

  // author's page
  navigationHelper.preFillAuthorDetailsWithOrcid()
  navigationHelper.setAuthorEmail('example@example.org')
  navigationHelper.navigateForward()

  // files' page
  navigationHelper.fillCoverletter()
  navigationHelper.uploadManuscript(manuscript)
  navigationHelper.uploadSupportingFiles(manuscript.supportingFiles)
  navigationHelper.navigateForward()
  await t.expect(files.ongoingFileUploadError.count).eql(1)
})
