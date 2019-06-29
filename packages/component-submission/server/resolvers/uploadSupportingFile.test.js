const fs = require('fs-extra')
const config = require('config')
const { createTables } = require('@elifesciences/component-model')
const AuditLog = require('@elifesciences/component-model-audit-log').model
const User = require('@elifesciences/component-model-user').model
const Manuscript = require('@elifesciences/component-model-manuscript').model
const startS3rver = require('@elifesciences/component-service-s3/mock')

const { Mutation } = require('.')
const { userData } = require('./index.test.data')

describe('uploadSupportingFile', () => {
  const profileId = userData.identities[0].identifier
  let userId
  let s3Server

  beforeEach(async () => {
    await createTables(true)
    const user = new User(userData)
    await user.saveGraph()
    userId = user.id

    const server = await startS3rver({
      ...config.get('aws.credentials'),
      ...config.get('aws.s3'),
    })
    s3Server = server.instance
  })

  afterEach(done => {
    s3Server.close(done)
  })

  it('adds supporting files to the manuscipt', async () => {
    let manuscript = await Manuscript.makeInitial({
      createdBy: userId,
    }).save()
    const { id } = manuscript
    const supportingFile = {
      filename: 'supporting.pdf',
      stream: fs.createReadStream(
        `${__dirname}/../../../../test/fixtures/dummy-supporting-1.pdf`,
      ),
      mimetype: 'application/pdf',
    }
    expect(manuscript.files).toHaveLength(0)
    await Mutation.uploadSupportingFile(
      {},
      { file: new Promise(resolve => resolve(supportingFile)), id },
      { user: profileId },
    )
    manuscript = await Manuscript.find(id, userId)
    expect(manuscript.files).toHaveLength(1)
    expect(manuscript.files[0].type).toEqual('SUPPORTING_FILE')
    expect(manuscript.files[0].filename).toEqual(supportingFile.filename)
    expect(manuscript.files[0].mimeType).toEqual(supportingFile.mimetype)
    expect(manuscript.files[0].status).toEqual('STORED')
    const audits = await AuditLog.all()
    expect(audits).toHaveLength(2)
    expect(audits[0].value).toBe('UPLOADED')
    expect(audits[0].objectId).toBe(manuscript.files[0].id)
    expect(audits[1].value).toBe('STORED')
    expect(audits[1].objectId).toBe(manuscript.files[0].id)
  })
})
