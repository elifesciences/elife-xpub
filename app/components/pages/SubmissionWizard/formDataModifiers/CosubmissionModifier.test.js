import CosubmissionModifier from './CosubmissionModifier'

const modifier = new CosubmissionModifier()

describe('CosubmissionModifier', () => {
  describe('from form to API', () => {
    it('handles no titles', () => {
      const values = { submissionMeta: {} }
      const originalValues = { submissionMeta: {} }
      modifier.fromForm(values, originalValues)

      expect(values.submissionMeta.cosubmission).toEqual([])
    })

    it('handles first title', () => {
      const values = { submissionMeta: {} }
      const originalValues = {
        submissionMeta: { firstCosubmissionTitle: 'hey' },
      }
      modifier.fromForm(values, originalValues)

      expect(values.submissionMeta.cosubmission).toEqual([{ title: 'hey' }])
    })

    it('handles both titles', () => {
      const values = { submissionMeta: {} }
      const originalValues = {
        submissionMeta: {
          firstCosubmissionTitle: 'hey',
          secondCosubmissionTitle: 'there',
        },
      }
      modifier.fromForm(values, originalValues)

      expect(values.submissionMeta.cosubmission).toEqual([
        { title: 'hey' },
        { title: 'there' },
      ])
    })

    it('ignores second title if first not set', () => {
      const values = { submissionMeta: {} }
      const originalValues = {
        submissionMeta: {
          firstCosubmissionTitle: null,
          secondCosubmissionTitle: 'there',
        },
      }
      modifier.fromForm(values, originalValues)

      expect(values.submissionMeta.cosubmission).toEqual([])
    })

    it('ignores empty strings', () => {
      const values = { submissionMeta: {} }
      const originalValues = {
        submissionMeta: {
          firstCosubmissionTitle: '',
          secondCosubmissionTitle: '',
        },
      }
      modifier.fromForm(values, originalValues)

      expect(values.submissionMeta.cosubmission).toEqual([])
    })
  })

  describe('from API to form', () => {
    it('handles no titles', () => {
      const values = { submissionMeta: { cosubmission: [] } }
      modifier.toForm(values)

      expect(values.submissionMeta).toEqual({
        cosubmission: [],
        firstCosubmissionTitle: null,
        secondCosubmissionTitle: null,
      })
    })

    it('handles one title', () => {
      const values = {
        submissionMeta: { cosubmission: [{ title: 'hey' }] },
      }
      modifier.toForm(values)

      expect(values.submissionMeta).toEqual({
        cosubmission: [{ title: 'hey' }],
        firstCosubmissionTitle: 'hey',
        secondCosubmissionTitle: null,
      })
    })

    it('handles two titles', () => {
      const values = {
        submissionMeta: {
          cosubmission: [{ title: 'hey' }, { title: 'there' }],
        },
      }
      modifier.toForm(values)

      expect(values.submissionMeta).toEqual({
        cosubmission: [{ title: 'hey' }, { title: 'there' }],
        firstCosubmissionTitle: 'hey',
        secondCosubmissionTitle: 'there',
      })
    })
  })
})
