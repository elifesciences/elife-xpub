jest.mock('@pubsweet/logger')
jest.mock('@elifesciences/component-meca', () => ({
  mecaExport: jest.fn(() => Promise.resolve()),
}))

const lodash = require('lodash')
const logger = require('@pubsweet/logger')
const { createTables } = require('@elifesciences/component-model')
const mailer = require('@pubsweet/component-send-email')
const { mecaExport } = require('@elifesciences/component-meca')
const User = require('@elifesciences/component-model-user').model
const Manuscript = require('@elifesciences/component-model-manuscript').model
const { S3Storage } = require('@elifesciences/component-service-s3')
const { submitManuscript, runExport } = require('./submitManuscript')

const {
  userData,
  badUserData,
  expectedManuscript,
  manuscriptInput,
} = require('./index.test.data')

const replaySetup = require('../../../../test/helpers/replay-setup')

async function waitforEmails(NUM_EMAILS) {
  for (let i = 0; i < 100 && mailer.getMails().length < NUM_EMAILS; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => setTimeout(resolve, 10))
  }
}

describe('Manuscripts', () => {
  const profileId = userData.identities[0].identifier
  const badProfileId = badUserData.identities[0].identifier
  let userId

  beforeEach(async () => {
    replaySetup('success')
    await createTables(true)
    const [user] = await Promise.all([
      User.createWithIdentity(profileId),
      User.createWithIdentity(badProfileId),
    ])
    userId = user.id
    mailer.clearMails()
  })

  describe('submitManuscript', () => {
    let id, initialManuscript

    beforeAll(() =>
      jest
        .spyOn(S3Storage, 'getContent')
        .mockImplementation(() => 'A real PDF'),
    )

    afterAll(() => S3Storage.getContent.mockRestore())

    beforeEach(async () => {
      jest.clearAllMocks()

      initialManuscript = Manuscript.makeInitial({ createdBy: userId })
      initialManuscript.files = [
        {
          url: 'fake-path.pdf',
          filename: 'FakeManuscript.pdf',
          type: 'MANUSCRIPT_SOURCE',
          status: 'STORED',
        },
      ]

      const manuscript = await initialManuscript.saveGraph()
      id = manuscript.id
    })

    it('calls the mecaExport function', async () => {
      const mockedExportFn = jest.fn()

      const promisedManuscript = submitManuscript(mockedExportFn)(
        {},
        { data: { ...manuscriptInput, id } },
        { user: profileId },
      )

      const beforeManuscript = await Manuscript.find(id, userId)
      expect(beforeManuscript.status).toBe(Manuscript.statuses.INITIAL)

      return promisedManuscript.then(async returnedManuscript => {
        expect(returnedManuscript.status).toBe(
          // It'll still be pending because it's executed asynchronously
          Manuscript.statuses.MECA_EXPORT_PENDING,
        )

        expect(mockedExportFn).toHaveBeenCalled()

        const storedManuscript = await Manuscript.find(id, userId)

        expect(storedManuscript).toMatchObject({
          ...expectedManuscript,
          status: 'MECA_EXPORT_PENDING',
        })
      })
    })

    it('throws error if manuscript fileStatus is not READY', async () => {
      let manuscript = await Manuscript.find(id, userId)
      const mockedExportFn = jest.fn(() => Promise.resolve())

      manuscript.files.push({
        url: 'fake-path.pdf',
        filename: 'FakeManuscript.pdf',
        type: 'SUPPORTING_FILE',
        status: 'CREATED',
      })
      manuscript = await manuscript.saveGraph()

      expect.assertions(3)
      expect(manuscript.files).toHaveLength(2)
      expect(manuscript.fileStatus).toBe('CHANGING')
      await expect(
        submitManuscript(mockedExportFn)(
          {},
          { data: { ...manuscriptInput, id } },
          { user: profileId },
        ),
      ).rejects.toEqual(
        new Error('Manuscript fileStatus is CHANGING', {
          manuscriptId: manuscript.id,
        }),
      )
    })

    it('calls meca export with correct arguments', async () => {
      const ip = '1.2.3.4'
      const mockedExportFn = jest.fn(() => Promise.resolve())

      await submitManuscript(mockedExportFn)(
        {},
        { data: { ...manuscriptInput, id } },
        { user: profileId, ip },
      )

      expect(mockedExportFn).toHaveBeenCalled()
      const [actualManuscript, , actualIp] = mockedExportFn.mock.calls[0]

      expect(actualManuscript.id).toBe(id)
      expect(actualIp).toBe(ip)
    })

    it('removes blank optional reviewer rows', async () => {
      const input = lodash.cloneDeep(manuscriptInput)
      const mockedExportFn = jest.fn(() => Promise.resolve())

      input.id = id
      input.suggestedReviewers = [
        { name: 'Reviewer 1', email: 'reviewer1@mail.com' },
        { name: 'Reviewer 2', email: 'reviewer2@mail.com' },
        { name: 'Reviewer 3', email: 'reviewer3@mail.com' },
        { name: '', email: '' },
        { name: 'Reviewer 4', email: 'reviewer4@mail.com' },
        { name: '', email: '' },
      ]
      await submitManuscript(mockedExportFn)(
        {},
        { data: input },
        { user: profileId },
      )

      const manuscript = await Manuscript.find(id, userId)
      const team = manuscript.teams.find(t => t.role === 'suggestedReviewer')
      expect(team.teamMembers.map(member => member.meta)).toEqual([
        { name: 'Reviewer 1', email: 'reviewer1@mail.com' },
        { name: 'Reviewer 2', email: 'reviewer2@mail.com' },
        { name: 'Reviewer 3', email: 'reviewer3@mail.com' },
        { name: 'Reviewer 4', email: 'reviewer4@mail.com' },
      ])
    })

    it("fails if manuscript doesn't belong to user", async () => {
      const blankManuscript = Manuscript.makeInitial({ createdBy: userId })
      const manuscript = await blankManuscript.save()
      const mockedExportFn = jest.fn(() => Promise.resolve())

      await expect(
        submitManuscript(mockedExportFn)(
          {},
          { data: { id: manuscript.id } },
          { user: badProfileId },
        ),
      ).rejects.toThrow('Manuscript not found')
    })

    it('fails if manuscript has already been submitted', async () => {
      const blankManuscript = Manuscript.makeInitial({
        createdBy: userId,
        status: Manuscript.statuses.MECA_EXPORT_PENDING,
      })
      const manuscript = await blankManuscript.save()
      const mockedExportFn = jest.fn(() => Promise.resolve())

      await expect(
        submitManuscript(mockedExportFn)(
          {},
          { data: { id: manuscript.id } },
          { user: profileId },
        ),
      ).rejects.toThrow(
        'Cannot submit manuscript with status of MECA_EXPORT_PENDING',
      )
    })

    // TODO more tests needed here
    it('fails when manuscript has incomplete data', async () => {
      const badManuscript = {
        id,
        title: 'Some Title',
      }
      const mockedExportFn = jest.fn(() => Promise.resolve())

      await expect(
        submitManuscript(mockedExportFn)(
          {},
          { data: badManuscript },
          { user: profileId },
        ),
      ).rejects.toThrow()
    })

    it('fails when manuscript has bad data types', async () => {
      const badManuscript = lodash.cloneDeep(manuscriptInput)
      const mockedExportFn = jest.fn(() => Promise.resolve())

      lodash.merge(badManuscript, {
        id,
        title: 100,
        manuscriptType: {},
      })
      await expect(
        submitManuscript(mockedExportFn)(
          {},
          { data: badManuscript },
          { user: profileId },
        ),
      ).rejects.toThrow(
        '"title" is not allowed. "manuscriptType" is not allowed',
      )
    })

    describe('runExport', () => {
      let manuscript

      it('sends a confirmation email to the submitter', async () => {
        const mockedExportFn = jest.fn(() => Promise.resolve())

        await submitManuscript(mockedExportFn)(
          {},
          { data: { ...manuscriptInput, id } },
          { user: profileId },
        )

        const updatedManuscript = await Manuscript.find(id, userId)
        await runExport(updatedManuscript, userId, '1.2.3.4')

        const NUM_EMAILS = 1
        await waitforEmails(NUM_EMAILS)
        const allEmails = mailer.getMails()

        expect(allEmails).toHaveLength(NUM_EMAILS)
        expect(allEmails[0]).toMatchObject({
          subject: 'Your eLife submission',
          to: 'mymail@mail.com',
          from: 'editorial@elifesciences.org',
        })
        expect(allEmails[0].text).toMatchSnapshot()
        expect(allEmails[0].html).toMatchSnapshot()
      })

      describe('export failure', () => {
        beforeEach(() => {
          jest.spyOn(logger, 'error').mockImplementationOnce(() => {})
          mecaExport.mockImplementationOnce(() =>
            Promise.reject(new Error('Borked')),
          )
          manuscript = lodash.cloneDeep(manuscriptInput)
          manuscript.id = id
        })

        it('sends email alert on failure', async () => {
          const mockedExportFn = jest.fn(() => Promise.resolve())
          await submitManuscript(mockedExportFn)(
            {},
            { data: manuscript },
            { user: profileId },
          )

          const updatedManuscript = await Manuscript.find(manuscript.id, userId)
          await runExport(updatedManuscript, userId, '1.2.3.4')

          const NUM_EMAILS = 1
          await waitforEmails(NUM_EMAILS)
          const allEmails = mailer.getMails()

          expect(allEmails).toHaveLength(NUM_EMAILS)
          expect(allEmails[0]).toMatchObject({
            to: 'test@example.com',
            subject: 'MECA export failed',
          })
        })

        it('updated status to MECA_EXPORT_FAILED', async () => {
          const mockedExportFn = jest.fn(() => Promise.resolve())
          await submitManuscript(mockedExportFn)(
            {},
            { data: manuscript },
            { user: profileId },
          )

          let updatedManuscript = await Manuscript.find(manuscript.id, userId)
          await runExport(updatedManuscript, userId, '1.2.3.4')

          updatedManuscript = await Manuscript.find(manuscript.id, userId)
          expect(updatedManuscript.status).toBe(
            Manuscript.statuses.MECA_EXPORT_FAILED,
          )
        })

        it('should log an error', async () => {
          const mockedExportFn = jest.fn(() => Promise.resolve())
          await submitManuscript(mockedExportFn)(
            {},
            { data: manuscript },
            { user: profileId },
          )

          const updatedManuscript = await Manuscript.find(manuscript.id, userId)
          await runExport(updatedManuscript, userId, '1.2.3.4')

          expect(logger.error).toHaveBeenCalledWith(
            'MECA export failed',
            expect.any(Error),
          )
        })
      })
    })
  })
})
