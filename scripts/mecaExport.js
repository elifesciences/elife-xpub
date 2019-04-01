const { db } = require('pubsweet-server')
const { mecaExport } = require('@elifesciences/component-meca')
const { S3Storage } = require('@elifesciences/xpub-client')
const Manuscript = require('@elifesciences/component-model-manuscript').model

const doExport = async (id, getContent, ip) => {
  const m = await Manuscript.query().where({ 'manuscript.id': id })
  const manuscript = await Manuscript.find(id, m[0].createdBy)

  manuscript.status = 'INITIAL'
  await manuscript.save()

  try {
    await mecaExport(manuscript, getContent, ip)
    await Manuscript.updateStatus(
      manuscript.id,
      Manuscript.statuses.MECA_EXPORT_SUCCEEDED,
    )
    console.log(`Manuscript ${manuscript.id} successfully exported`)
  } catch (err) {
    console.error('MECA export failed', err)
    await Manuscript.updateStatus(
      manuscript.id,
      Manuscript.statuses.MECA_EXPORT_FAILED,
    )
  }
  console.log('Export complete!')
  db.destroy()
}

// Run from the command line takes a manuscript id for the first arg.
if (process.argv.length < 3 || !process.argv[2]) {
  console.error('Need to supply a manuscript id as an argument!')
  process.exit(1)
}

const id = process.argv[2]

if (id.length !== 36) {
  console.error('That does not look like a manuscript id')
  process.exit(1)
}

doExport(id, S3Storage.getContent, '1.2.3.4')
