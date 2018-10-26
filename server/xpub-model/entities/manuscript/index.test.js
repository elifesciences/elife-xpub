const { createTables } = require('@pubsweet/db-manager')
const Manuscript = require('.')

describe('Manuscript', () => {
  beforeEach(() => createTables(true))

  describe('applyInput', () => {
    it('picks only whitelisted properties', () => {
      const originalManuscript = {
        meta: { title: 'Apples' },
        other: 'boo',
        teams: [],
      }
      const input = { meta: { title: 'Oranges' }, other: 'frank' }
      const manuscript = Manuscript.applyInput(originalManuscript, input)
      expect(manuscript).toMatchObject({
        meta: { title: 'Oranges' },
        other: 'boo',
      })
    })

    it('updates teams', () => {
      const originalManuscript = {
        teams: [
          { id: 1, role: 'author', teamMembers: [] },
          {
            id: 2,
            role: 'suggestedSeniorEditor',
            teamMembers: [{ meta: { elifePersonId: 10 } }],
          },
        ],
      }
      const input = {
        author: { firstName: 'Freddie' },
        suggestedReviewingEditors: [11, 12],
      }
      const manuscript = Manuscript.applyInput(originalManuscript, input)
      expect(manuscript).toEqual({
        teams: [
          {
            id: 1,
            role: 'author',
            teamMembers: [
              {
                alias: { firstName: 'Freddie' },
                meta: { corresponding: true },
              },
            ],
          },
          {
            id: 2,
            role: 'suggestedSeniorEditor',
            teamMembers: [],
          },
          {
            role: 'opposedSeniorEditor',
            teamMembers: [],
          },
          {
            role: 'suggestedReviewingEditor',
            teamMembers: [
              { meta: { elifePersonId: 11 } },
              { meta: { elifePersonId: 12 } },
            ],
          },
          {
            role: 'opposedReviewingEditor',
            teamMembers: [],
          },
          {
            role: 'suggestedReviewer',
            teamMembers: [],
          },
          {
            role: 'opposedReviewer',
            teamMembers: [],
          },
        ],
      })
    })
  })

  describe('addTeam', () => {
    it('adds team', () => {
      const team = { id: 1, role: 'author' }
      const manuscript = { teams: [] }
      Manuscript.addTeam(manuscript, team)
      expect(manuscript.teams).toEqual([team])
    })

    it('updates team with same role', () => {
      const manuscript = {
        teams: [
          { id: 1, role: 'author', teamMembers: [{ id: 4 }] },
          { id: 2, role: 'seniorEditor' },
        ],
      }
      Manuscript.addTeam(manuscript, {
        role: 'author',
        teamMembers: [{ id: 3 }],
      })
      expect(manuscript.teams).toEqual([
        { id: 1, role: 'author', teamMembers: [{ id: 3 }] },
        { id: 2, role: 'seniorEditor' },
      ])
    })
  })

  describe('save()', () => {
    it('fails to update non-existent manuscript', () =>
      expect(
        Manuscript.save({
          id: 'f05bbbf9-ddf4-494f-a8da-84957e2708ee',
          status: 'INITIAL',
        }),
      ).rejects.toThrow('Manuscript not found'))
  })
})
