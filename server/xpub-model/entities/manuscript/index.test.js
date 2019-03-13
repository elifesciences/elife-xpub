const { createTables } = require('@pubsweet/db-manager')
const uuid = require('uuid')
const Team = require('../team')
const User = require('../user')
const File = require('../file')
const AuditLog = require('../auditLog')
const Manuscript = require('.')

describe('Manuscript', () => {
  let userId

  beforeEach(async () => {
    await createTables(true)
    const profileId = 'ewwboc7m'
    const identities = [{ type: 'elife', identifier: profileId }]
    const user = await new User({ identities }).save()
    userId = user.id
  })

  describe('applyInput()', () => {
    it('picks only whitelisted properties', () => {
      const manuscript = new Manuscript({
        meta: {
          title: 'Apples',
        },
        status: 'boo',
        teams: [],
      })
      const input = {
        meta: {
          title: 'Oranges',
        },
        other: 'frank',
      }
      manuscript.applyInput(input)
      expect(manuscript).toMatchObject({
        meta: {
          title: 'Oranges',
        },
        status: 'boo',
      })
    })

    it('throws an error if selected editor is opposed', () => {
      const manuscript = new Manuscript({})
      const conflictingInput = {
        suggestedSeniorEditors: ['1'],
        opposedSeniorEditors: ['1'],
      }
      expect(() => manuscript.applyInput(conflictingInput)).toThrow()
    })

    it('updates teams', () => {
      const manuscript = new Manuscript({
        teams: [
          {
            id: 1,
            role: 'author',
            teamMembers: [],
          },
          {
            id: 2,
            role: 'suggestedSeniorEditor',
            teamMembers: [
              {
                meta: {
                  elifePersonId: 10,
                },
              },
            ],
          },
        ],
      })

      const input = {
        author: {
          firstName: 'Freddie',
        },
        suggestedReviewingEditors: [11, 12],
      }
      manuscript.applyInput(input)
      expect(manuscript.teams).toEqual([
        {
          id: 1,
          role: 'author',
          objectType: 'manuscript',
          teamMembers: [
            {
              alias: {
                firstName: 'Freddie',
              },
              meta: {
                corresponding: true,
              },
            },
          ],
        },
        {
          id: 2,
          role: 'suggestedSeniorEditor',
          objectType: 'manuscript',
          teamMembers: [],
        },
        {
          role: 'opposedSeniorEditor',
          objectType: 'manuscript',
          teamMembers: [],
        },
        {
          role: 'suggestedReviewingEditor',
          objectType: 'manuscript',
          teamMembers: [
            {
              meta: {
                elifePersonId: 11,
              },
            },
            {
              meta: {
                elifePersonId: 12,
              },
            },
          ],
        },
        {
          role: 'opposedReviewingEditor',
          objectType: 'manuscript',
          teamMembers: [],
        },
        {
          role: 'suggestedReviewer',
          objectType: 'manuscript',
          teamMembers: [],
        },
        {
          role: 'opposedReviewer',
          objectType: 'manuscript',
          teamMembers: [],
        },
      ])
    })
  })

  describe('get fileStatus()', () => {
    describe('given there are no files', () => {
      it('returns READY', () => {
        const manuscript = new Manuscript({
          createdBy: userId,
        })
        manuscript.files = []
        expect(manuscript.fileStatus).toEqual('READY')
      })
    })

    describe('given there is a single file', () => {
      let manuscript
      let file
      let setStatusOfFirstFile

      beforeEach(async () => {
        manuscript = await createInitialManuscript(userId)
        manuscript = await addFileToManuscript(manuscript)
        file = await File.find(manuscript.files[0].id)
        await file.save()
        setStatusOfFirstFile = setStatusOfFile.bind(null,
          file.id, manuscript.id, userId
        )
      })

      it('returns READY when the file is stored', async () => {
        manuscript = await setStatusOfFirstFile('STORED')
        expect(manuscript.fileStatus).toEqual('READY')
      })

      it('returns READY when the file upload was cancelled', async () => {
        manuscript = await setStatusOfFirstFile('CANCELLED')
        expect(manuscript.fileStatus).toEqual('READY')
      })

      it('returns CHANGING when the file has been uploaded to the app server', async () => {
        manuscript = await setStatusOfFirstFile('UPLOADED')
        expect(manuscript.fileStatus).toEqual('CHANGING')
      })

      it('returns CHANGING when the file has been created in the database', async () => {
        manuscript = await setStatusOfFirstFile('CREATED')
        expect(manuscript.fileStatus).toEqual('CHANGING')
      })
    })

    describe('given there are multiple files', () => {
      let manuscript
      let file1, file2
      let setStatusOfFirstFile, setStatusOfSecondFile

      beforeEach(async () => {
        manuscript = await createInitialManuscript(userId)
        manuscript = await addFileToManuscript(manuscript)
        manuscript = await addFileToManuscript(manuscript);
        [ file1, file2 ] = await Promise.all(
          manuscript.files.map(({ id }) => File.find(id))
        )
        expect(file1.id).not.toEqual(file2.id)
        setStatusOfFirstFile = setStatusOfFile.bind(null,
          file1.id, manuscript.id, userId
        )
        setStatusOfSecondFile = setStatusOfFile.bind(null,
          file2.id, manuscript.id, userId
        )
      })

      it('returns READY when both files are stored', async () => {
        manuscript = await setStatusOfFirstFile('STORED')
        manuscript = await setStatusOfSecondFile('STORED')
        expect(manuscript.fileStatus).toEqual('READY')
      })

      it('returns READY when both files are cancelled', async () => {
        manuscript = await setStatusOfFirstFile('CANCELLED')
        manuscript = await setStatusOfSecondFile('CANCELLED')
        expect(manuscript.fileStatus).toEqual('READY')
      })

      it('returns READY when one file is stored and once is cancelled', async () => {
        manuscript = await setStatusOfFirstFile('STORED')
        manuscript = await setStatusOfSecondFile('CANCELLED')
        expect(manuscript.fileStatus).toEqual('READY')
      })

      it('returns CHANGING when one file has been uploaded to the app server', async () => {
        manuscript = await setStatusOfFirstFile('STORED')
        manuscript = await setStatusOfSecondFile('UPLOADED')
        expect(manuscript.fileStatus).toEqual('CHANGING')
      })

      it('returns CHANGING when one file has been created in the database', async () => {
        manuscript = await setStatusOfFirstFile('STORED')
        manuscript = await setStatusOfSecondFile('CREATED')
        expect(manuscript.fileStatus).toEqual('CHANGING')
      })

      it('returns CHANGING when both files have been uploaded to the app server', async () => {
        manuscript = await setStatusOfFirstFile('UPLOADED')
        manuscript = await setStatusOfSecondFile('UPLOADED')
        expect(manuscript.fileStatus).toEqual('CHANGING')
      })

      it('returns CHANGING when both files have been created in the database', async () => {
        manuscript = await setStatusOfFirstFile('CREATED')
        manuscript = await setStatusOfSecondFile('CREATED')
        expect(manuscript.fileStatus).toEqual('CHANGING')
      })
    })
  })

  describe('addTeam()', () => {
    it('adds team', () => {
      const team = {
        id: 1,
        role: 'author',
      }
      const manuscript = new Manuscript({
        teams: [],
      })
      manuscript.addTeam(team)
      expect(manuscript.teams).toMatchObject([team])
    })

    it('updates team with same role', () => {
      const manuscript = new Manuscript({
        teams: [
          {
            id: 1,
            role: 'author',
            teamMembers: [
              {
                id: 4,
              },
            ],
          },
          {
            id: 2,
            role: 'seniorEditor',
          },
        ],
      })
      manuscript.addTeam({
        role: 'author',
        teamMembers: [
          {
            id: 3,
          },
        ],
      })
      expect(manuscript.teams).toMatchObject([
        {
          id: 1,
          role: 'author',
          teamMembers: [
            {
              id: 3,
            },
          ],
        },
        {
          id: 2,
          role: 'seniorEditor',
        },
      ])
    })
  })

  describe('find()', () => {
    it('finds by manuscript id', async () => {
      const manuscript = new Manuscript({
        createdBy: userId,
      })
      await manuscript.save()
      const loadedManuscript = await Manuscript.find(manuscript.id, userId)
      expect(loadedManuscript.id).toBe(manuscript.id)
    })

    it('eager loads relations', async () => {
      const manuscript = new Manuscript({
        createdBy: userId,
      })
      manuscript.addTeam({
        role: 'foo',
        teamMembers: [],
      })
      await manuscript.save()
      const loadedManuscript = await Manuscript.find(manuscript.id, userId)
      expect(loadedManuscript.teams).toHaveLength(1)
    })

    it('throws if nothing matches', () =>
      expect(
        Manuscript.find('f05bbbf9-ddf4-494f-a8da-84957e2708ee', userId),
      ).rejects.toThrow('Manuscript not found'))
  })

  describe('Manuscript.findByStatus()', () => {
    it('finds by status', async () => {
      const manuscript = new Manuscript({
        createdBy: userId,
      })
      await manuscript.save()
      const loadedManuscripts = await Manuscript.findByStatus('INITIAL', userId)
      expect(loadedManuscripts).toHaveLength(1)
    })

    it('eager loads relations', async () => {
      const manuscript = new Manuscript({
        createdBy: userId,
      })
      manuscript.addTeam({
        role: 'foo',
        teamMembers: [],
      })
      await manuscript.save()
      const loadedManuscripts = await Manuscript.findByStatus('INITIAL', userId)
      expect(loadedManuscripts[0].teams).toHaveLength(1)
    })

    it('returns empty array if nothing matches', () =>
      expect(Manuscript.findByStatus('FAKE', userId)).resolves.toEqual([]))
  })

  describe('Manuscript.updateStatus', () => {
    it('updates status', async () => {
      const manuscript = await new Manuscript({
        meta: {
          title: 'Title',
        },
        createdBy: userId,
      }).save()
      const loadedManuscript = await Manuscript.updateStatus(
        manuscript.id,
        'NEXT',
      )
      expect(loadedManuscript).toMatchObject({
        status: 'NEXT',
        meta: {
          title: 'Title',
        },
      })
    })

    it("adds an entry to the manuscript's audit log", async () => {
      const manuscript = await new Manuscript({
        createdBy: userId,
      }).save()
      const loadedManuscript = await Manuscript.updateStatus(
        manuscript.id,
        'NEXT',
      )
      const audits = await AuditLog.all()

      expect(loadedManuscript.status).toBe('NEXT')
      expect(audits).toHaveLength(1)
      expect(audits[0]).toMatchObject({
        action: 'UPDATED',
        objectType: 'manuscript.status',
        value: 'NEXT',
      })
    })

    it('fails to update non-existent manuscript', () =>
      expect(
        Manuscript.updateStatus('f05bbbf9-ddf4-494f-a8da-84957e2708ee', 'NEXT'),
      ).rejects.toThrow('Manuscript not found'))
  })

  describe('refresh()', () => {
    it('refreshes manuscript', async () => {
      const ms = await getThreeVersions(userId)

      // update and save v3
      ms.v3.meta.title = 'Version3'
      ms.v3 = await ms.v3.save()
      expect(ms.v3.meta.title).toBe('Version3')
      expect(getDbTime(ms.v1.updated)).toBeLessThan(getDbTime(ms.v3.updated))

      // If you are refreshing - it should now be v3
      ms.v2.meta.title = 'Version2'
      await ms.v2.refresh()
      expect(ms.v2.meta.title).toBe('Version3')

      const msFinal = await Manuscript.find(ms.v1.id, userId)
      expect(msFinal.meta.title).toBe('Version3')
    })
  })

  describe('save()', () => {
    it('returns promise of self', async () => {
      const manuscript = new Manuscript({
        createdBy: userId,
      })
      await expect(manuscript.save()).resolves.toBe(manuscript)
    })

    it('populates ID', async () => {
      const manuscript = new Manuscript({
        createdBy: userId,
      })
      expect(manuscript.id).toBeUndefined()
      await manuscript.save()
      expect(manuscript.id).not.toBe(undefined)
    })

    it('maintains loaded relations', async () => {
      const manuscript = new Manuscript({
        createdBy: userId,
      })
      manuscript.addTeam({
        role: 'foo',
        teamMembers: [],
      })
      await manuscript.save()
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
      await manuscript.save()
      expect(manuscript.teams).toHaveLength(1)
      expect(manuscript.teams[0].role).toEqual('bar')
    })

    it('fails to update non-existent manuscript', () =>
      expect(
        new Manuscript({
          id: 'f05bbbf9-ddf4-494f-a8da-84957e2708ee',
          status: 'INITIAL',
        }).save(),
      ).rejects.toThrow())

    it('does not overwrite an updated manuscript', async () => {
      const ms = await getThreeVersions(userId)

      // update and save v3
      ms.v3.meta.title = 'Version3'
      ms.v3 = await ms.v3.save()
      expect(ms.v3.meta.title).toBe('Version3')
      expect(getDbTime(ms.v1.updated)).toBeLessThan(getDbTime(ms.v3.updated))

      // If you are not refreshing - save() should not work and throw
      ms.v2.meta.title = 'Version2'
      // Temporarily commented out see #1162
      // await expect(ms.v2.save()).rejects.toThrow(
      //   'Data Integrity Error property updated',
      // )

      const msFinal = await Manuscript.find(ms.v1.id, userId)
      expect(msFinal.meta.title).toBe('Version3')
    })
  })

  describe('Manuscript.all()', () => {
    it("returns users's manuscripts only", async () => {
      const secondUserId = uuid()
      await new Manuscript({
        createdBy: userId,
      }).save()
      await new Manuscript({
        createdBy: secondUserId,
      }).save()
      const loadedManuscripts = await Manuscript.all(userId)
      expect(loadedManuscripts).toHaveLength(1)
    })
    it('returns in the correct order', async () => {
      const originalDate = Date
      const createManuscript = async (createdDate, title) => {
        // Mock Date so the created by can be controlled
        const mockDate = new Date(createdDate)
        global.Date = jest.fn(() => mockDate)
        global.Date.now = originalDate.now
        global.Date.UTC = originalDate.UTC

        await new Manuscript({
          meta: {
            title,
          },
          createdBy: userId,
        }).save()

        // Reset Date object so calling new Date returns a real Date object
        global.Date = originalDate
      }

      await createManuscript('2019-01-09T14:50:48.476Z', '0')
      await createManuscript('2019-01-04T14:50:48.476Z', '3')
      await createManuscript('2019-01-07T17:50:48.476Z', '1')
      await createManuscript('2019-01-05T17:50:48.476Z', '2')

      const orderedManuscripts = await Manuscript.all(userId)
      orderedManuscripts.forEach((manuscript, index) => {
        expect(manuscript.meta.title).toEqual(index.toString())
      })
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

const setStatusOfFile = async (fileId, manuscriptId, userId, status) => {
  const file = await File.find(fileId)
  file.status = status
  await file.save()
  return Manuscript.find(manuscriptId, userId)
}

const addFileToManuscript = async (manuscript) => {
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
