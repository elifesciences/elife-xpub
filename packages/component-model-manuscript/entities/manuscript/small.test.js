const { createTables } = require('@elifesciences/component-model')
const uuid = require('uuid')
const Team = require('@elifesciences/component-model-team').model
const User = require('@elifesciences/component-model-user').model
const File = require('@elifesciences/component-model-file').model
const AuditLog = require('@elifesciences/component-model-audit-log').model
const Manuscript = require('.')

describe('Manuscript', () => {
  let userId

  beforeEach(async () => {
    await createTables(true)
    const profileId = 'ewwboc7m'
    const user = await User.createWithIdentity(profileId)
    userId = user.id
  })

  describe('Small', () => {
    it.only('eager loads relations', async () => {
      const manuscript = new Manuscript({
        createdBy: userId,
      })
      // need to first save to get the related id to the object
      await manuscript.save()
      manuscript.addTeam({
        id: uuid(),
        role: 'foo',
        teamMembers: [],
      })

      console.log('B', manuscript.id, manuscript.teams)
      await manuscript.saveRecursively()
      console.log('C', manuscript.id, manuscript.teams)
      const loadedManuscript = await Manuscript.find(manuscript.id, userId)
      console.log('D', manuscript.id, manuscript.teams)
      console.log('E', loadedManuscript.id, loadedManuscript.teams)
      expect(loadedManuscript.teams).toHaveLength(1)
    })

    it('eager loads relations', async () => {
      const manuscript = new Manuscript({
        createdBy: userId,
      })
      manuscript.addTeam({
        role: 'foo',
        teamMembers: [],
      })
      await manuscript.saveRecursively()
      const loadedManuscripts = await Manuscript.findByStatus('INITIAL', userId)
      expect(loadedManuscripts[0].teams).toHaveLength(1)
    })

    it('returns empty array if nothing matches', () => {
      expect(Manuscript.findByStatus('FAKE', userId)).resolves.toEqual([])
    })

    it('maintains loaded relations', async () => {
      const manuscript = new Manuscript({
        createdBy: userId,
      })
      manuscript.addTeam({
        role: 'foo',
        teamMembers: [],
      })
      await manuscript.saveRecursively()
      // at the moment saveRecursively does not maintain loaded relations
      expect(manuscript.teams).toHaveLength(1)
    })

    it('deletes related entities not on the manuscript', async () => {
      const manuscript = new Manuscript({
        createdBy: userId,
      })
      await manuscript.save()

      // create a team and make sure it's not on the manuscript
      const team = new Team({
        role: 'foo',
        teamMembers: [],
        objectType: 'manuscript',
        objectId: manuscript.id,
      })
      await team.save()
      expect(manuscript.teams).toHaveLength(0)

      manuscript.addTeam({
        role: 'bar',
        teamMembers: [],
      })
      // at the moment saveRecursively does not maintain loaded relations
      expect(manuscript.teams).toHaveLength(1)
      await manuscript.saveRecursively()
      expect(manuscript.teams).toHaveLength(1)
      expect(manuscript.teams[0].role).toEqual('bar')
    })
  })
})

const getDbTime = time => new Date(time).getTime()

const getThreeVersions = async userId => {
  const v1 = await new Manuscript({
    createdBy: userId,
    meta: {
      title: 'Version1',
    },
  }).save()
  const v2 = await Manuscript.find(v1.id, userId)
  const v3 = await Manuscript.find(v1.id, userId)

  expect(v1).toHaveProperty('updated')
  expect(getDbTime(v1.updated)).toEqual(getDbTime(v1.created))
  expect(getDbTime(v2.updated)).toEqual(getDbTime(v2.created))
  expect(getDbTime(v3.updated)).toEqual(getDbTime(v3.created))

  return { v1, v2, v3 }
}

const setStatusOfFile = async (file, manuscript, status) => {
  file.status = status // eslint-disable-line no-param-reassign
  await file.save()
  return Manuscript.find(manuscript.id, manuscript.createdBy)
}

const addFileToManuscript = async manuscript => {
  const file = new File({
    manuscriptId: manuscript.id,
    filename: 'test.txt',
    url: '-',
    type: 'test_file',
  })
  await file.save()
  return Manuscript.find(manuscript.id, manuscript.createdBy)
}

const createInitialManuscript = async (userId, title = 'Alpha') => {
  const manuscript = new Manuscript({
    createdBy: userId,
    meta: {
      title,
    },
    status: 'initial',
    teams: [],
  })
  await manuscript.save()
  return manuscript
}
