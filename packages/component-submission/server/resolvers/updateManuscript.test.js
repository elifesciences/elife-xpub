jest.mock('@pubsweet/logger')

const { keyBy } = require('lodash')
const { createTables } = require('@elifesciences/component-model')
const User = require('@elifesciences/component-model-user').model
const Manuscript = require('@elifesciences/component-model-manuscript').model
const Team = require('@elifesciences/component-model-team').model

const { Mutation } = require('.')
const {
  userData,
  badUserData,
  expectedManuscript,
  manuscriptInput,
} = require('./index.test.data')

const replaySetup = require('../../../../test/helpers/replay-setup')

describe('Manuscript resolvers', () => {
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
  })

  describe('updateManuscript', () => {
    it("fails if manuscript doesn't belong to user", async () => {
      const manuscript = await Manuscript.makeInitial({
        createdBy: userId,
      }).saveGraph()
      await expect(
        Mutation.updateManuscript(
          {},
          { data: { id: manuscript.id } },
          { user: badProfileId },
        ),
      ).rejects.toThrow('Manuscript not found')
    })

    it('fails if manuscript has already been submitted', async () => {
      const manuscript = await Manuscript.makeInitial({
        createdBy: userId,
        status: Manuscript.statuses.MECA_EXPORT_PENDING,
      }).saveGraph()
      await expect(
        Mutation.updateManuscript(
          {},
          { data: { id: manuscript.id } },
          { user: profileId },
        ),
      ).rejects.toThrow(
        'Cannot update manuscript with status of MECA_EXPORT_PENDING',
      )
    })

    it('updates the current submission for user with data', async () => {
      const manuscript = await Manuscript.makeInitial({
        createdBy: userId,
      }).saveGraph()

      await Mutation.updateManuscript(
        {},
        { data: { id: manuscript.id, ...manuscriptInput } },
        { user: profileId },
      )
      const actualManuscript = await Manuscript.find(manuscript.id, userId)
      expect(actualManuscript).toMatchObject(expectedManuscript)
    })

    it('updates the current submission teams', async () => {
      const manuscript = await Manuscript.makeInitial({
        createdBy: userId,
      }).saveGraph()

      await Mutation.updateManuscript(
        {},
        { data: { id: manuscript.id, ...manuscriptInput } },
        { user: profileId },
      )
      const teams = keyBy(await Team.findByManuscriptId(manuscript.id), 'role')

      expect(teams.author).toMatchObject({
        role: 'author',
        objectType: 'manuscript',
        objectId: manuscript.id,
        teamMembers: [
          { alias: manuscriptInput.author, meta: { corresponding: true } },
        ],
      })
      expect(teams.suggestedSeniorEditor).toMatchObject({
        role: 'suggestedSeniorEditor',
        objectType: 'manuscript',
        objectId: manuscript.id,
        teamMembers: [
          { meta: { elifePersonId: 'ab12' } },
          { meta: { elifePersonId: 'cd34' } },
        ],
      })
      expect(teams.opposedSeniorEditor).toMatchObject({
        role: 'opposedSeniorEditor',
        objectType: 'manuscript',
        objectId: manuscript.id,
        teamMembers: [{ meta: { elifePersonId: 'ij90' } }],
      })
      expect(teams.suggestedReviewingEditor).toMatchObject({
        role: 'suggestedReviewingEditor',
        objectType: 'manuscript',
        objectId: manuscript.id,
        teamMembers: [
          { meta: { elifePersonId: 'ef56' } },
          { meta: { elifePersonId: 'gh78' } },
        ],
      })
      expect(teams.opposedReviewingEditor).toMatchObject({
        role: 'opposedReviewingEditor',
        objectType: 'manuscript',
        objectId: manuscript.id,
        teamMembers: [{ meta: { elifePersonId: 'kl12' } }],
      })
      expect(teams.suggestedReviewer).toMatchObject({
        role: 'suggestedReviewer',
        objectType: 'manuscript',
        objectId: manuscript.id,
        teamMembers: [
          { meta: manuscriptInput.suggestedReviewers[0] },
          { meta: manuscriptInput.suggestedReviewers[1] },
          { meta: manuscriptInput.suggestedReviewers[2] },
        ],
      })
      expect(teams.opposedReviewer).toMatchObject({
        role: 'opposedReviewer',
        objectType: 'manuscript',
        objectId: manuscript.id,
        teamMembers: [{ meta: manuscriptInput.opposedReviewers[0] }],
      })
    })
  })
})
