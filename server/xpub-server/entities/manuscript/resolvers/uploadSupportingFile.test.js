const fs = require('fs-extra')
const config = require('config')
const { createTables } = require('@pubsweet/db-manager')
const { User, Manuscript } = require('@elifesciences/xpub-model')
const { Mutation } = require('.')
const { userData } = require('./index.test.data')
const startS3rver = require('../../../test/mock-s3-server')

describe('uploadSupportingFile', () => {
  const profileId = userData.identities[0].identifier
  let userId
  let s3Server

  beforeEach(async () => {
    await createTables(true)
    const user = new User(userData)
    await user.save()
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
    let manuscript = await new Manuscript({
      createdBy: userId,
    }).save()
    const { id } = manuscript
    const supportingFile = {
      filename: 'supporting.pdf',
      stream: fs.createReadStream(
        `${__dirname}/../../../../../test/fixtures/dummy-supporting-1.pdf`,
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
  })
})
