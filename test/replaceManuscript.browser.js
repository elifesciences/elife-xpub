import { files } from './pageObjects'
import setFixtureHooks from './helpers/set-fixture-hooks'
import NavigationHelper from './helpers/navigationHelper'

const f = fixture('Submission')
setFixtureHooks(f)

const manuscript = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript.pdf',
  fileName: 'dummy-manuscript.pdf',
}

const unsupportedManuscriptFile = {
  title: 'Image',
  file: './fixtures/dummy-manuscript-3.png',
  fileName: 'dummy-manuscript-3.png',
}

const manuscriptReplacement = {
  title: 'The Relationship Between Lamport Clocks and Interrupts Using Obi',
  file: './fixtures/dummy-manuscript-2.pdf',
  fileName: 'dummy-manuscript-2.pdf',
}

test('Replace Manuscript on the Submission', async t => {
  const navigationHelper = new NavigationHelper(t)
  const filesPage = navigationHelper.getFilesPage()

  await navigationHelper.skipToFilesPage()

  // uploading files - manuscript and cover letter
  await filesPage.writeShortCoverLetter()

  await filesPage.uploadManuscript(
    unsupportedManuscriptFile,
    'That file is not supported',
  )
  await filesPage.uploadManuscript(manuscript)

  await t.expect(files.fileName.textContent).eql(manuscript.fileName)

  await filesPage.uploadManuscript(manuscriptReplacement)
  await t.expect(files.fileName.textContent).eql(manuscriptReplacement.fileName)
})
