import CosubmissionModifier from './CosubmissionModifier'

const modifier = new CosubmissionModifier()

describe('CosubmissionModifier', () => {
  describe('from form to API', () => {
    it('handles no titles', () => {
      const values = {}
      const originalValues = {}
      modifier.fromForm(values, originalValues)

      expect(values.cosubmission).toEqual([])
    })

    it('handles first title', () => {
      const values = {}
      const originalValues = {
        firstCosubmissionTitle: 'hey',
      }
      modifier.fromForm(values, originalValues)

      expect(values.cosubmission).toEqual(['hey'])
    })

    it('handles both titles', () => {
      const values = {}
      const originalValues = {
        firstCosubmissionTitle: 'hey',
        secondCosubmissionTitle: 'there',
      }
      modifier.fromForm(values, originalValues)

      expect(values.cosubmission).toEqual(['hey', 'there'])
    })

    it('ignores second title if first not set', () => {
      const values = {}
      const originalValues = {
        firstCosubmissionTitle: null,
        secondCosubmissionTitle: 'there',
      }
      modifier.fromForm(values, originalValues)

      expect(values.cosubmission).toEqual([])
    })

    it('ignores empty strings', () => {
      const values = {}
      const originalValues = {
        firstCosubmissionTitle: '',
        secondCosubmissionTitle: '',
      }
      modifier.fromForm(values, originalValues)

      expect(values.cosubmission).toEqual([])
    })
  })

  describe('from API to form', () => {
    it('handles no titles', () => {
      const values = { cosubmission: [] }
      modifier.toForm(values)

      expect(values).toEqual({
        cosubmission: [],
        firstCosubmissionTitle: null,
        secondCosubmissionTitle: null,
      })
    })

    it('handles one title', () => {
      const values = {
        cosubmission: ['hey'],
      }
      modifier.toForm(values)

      expect(values).toEqual({
        cosubmission: ['hey'],
        firstCosubmissionTitle: 'hey',
        secondCosubmissionTitle: null,
      })
    })

    it('handles two titles', () => {
      const values = {
        cosubmission: ['hey', 'there'],
      }
      modifier.toForm(values)

      expect(values).toEqual({
        cosubmission: ['hey', 'there'],
        firstCosubmissionTitle: 'hey',
        secondCosubmissionTitle: 'there',
      })
    })
  })
})
