jest.mock('@pubsweet/logger')

const config = require('config')
const fs = require('fs-extra')
const { createTables } = require('@elifesciences/component-model')
const mailer = require('@pubsweet/component-send-email')
const User = require('@elifesciences/component-model-user').model
const Manuscript = require('@elifesciences/component-model-manuscript').model
const { Query, Assignee } = require('.')
const { userData } = require('./index.test.data')

const replaySetup = require('../../../../test/helpers/replay-setup')

describe('Manuscripts', () => {
  const profileId = userData.identities[0].identifier
  let userId

  beforeEach(async () => {
    replaySetup('success')
    await Promise.all([
      fs.remove(config.get('pubsweet-server.uploads')),
      createTables(true),
    ])
    const user = await new User(userData).saveGraph()
    userId = user.id
    mailer.clearMails()
  })

  describe('manuscript', () => {
    it('Gets form data', async () => {
      const manuscriptData = {
        createdBy: userId,
        meta: { title: 'title' },
        status: 'INITIAL',
      }

      const { id } = await Manuscript.makeInitial(manuscriptData).saveGraph()
      const manuscript = await Query.manuscript({}, { id }, { user: profileId })
      expect(manuscript).toMatchObject(manuscriptData)
    })
  })
})

describe('component-submission resolvers', () => {
  beforeEach(async () => {
    await createTables(true)
    replaySetup('success')
  })

  describe('editors', () => {
    it('returns a list of senior editors', async () => {
      const result = await Query.editors({}, { role: 'senior-editor' })
      expect(result.length).toBeGreaterThanOrEqual(40)
      expect(result[0]).toEqual({
        id: '8d7e57b3',
        aff: undefined,
        name: 'Richard Aldrich',
        focuses: [
          'ion channels',
          'calcium binding proteins',
          'membrane transport',
          'allostery and cooperativity',
          'cellular neurophysiology',
          'biochemical neuroscience',
        ],
        expertises: [
          'Structural Biology and Molecular Biophysics',
          'Neuroscience',
        ],
      })
    })
  })

  describe('assignees', () => {
    it('resolves assignees correctly', async () => {
      expect(Assignee.__resolveType({ focuses: 'focus' })).toBe('EditorAlias')
      expect(Assignee.__resolveType({ expertises: 'expertise' })).toBe(
        'EditorAlias',
      )
      expect(Assignee.__resolveType({ name: 'john' })).toBe('ReviewerAlias')
      expect(Assignee.__resolveType({ email: 'john.smith@example.com' })).toBe(
        'ReviewerAlias',
      )
      expect(Assignee.__resolveType({ firstName: 'john' })).toBe('AuthorAlias')
    })
  })
})
