import parseInputToFormData, {
  parseCosubmissionInput,
  parseTitleSuggestion,
} from './parseInputToFormData'

describe('parseCosubmissionInput', () => {
  it('empty array returns both values null', () => {
    expect(parseCosubmissionInput([])).toEqual({
      firstCosubmissionTitle: null,
      secondCosubmissionTitle: null,
    })
  })

  it('single array value gets mapped to object correctly', () => {
    expect(parseCosubmissionInput(['hey'])).toEqual({
      firstCosubmissionTitle: 'hey',
      secondCosubmissionTitle: null,
    })
  })

  it('multiple values get mapped to object correctly', () => {
    expect(parseCosubmissionInput(['hey', 'there'])).toEqual({
      firstCosubmissionTitle: 'hey',
      secondCosubmissionTitle: 'there',
    })
  })
})

describe('parseInputToFormData', () => {
  it('returns object with null cosubmission titles when passed empty object', () => {
    expect(parseInputToFormData({})).toEqual({
      firstCosubmissionTitle: null,
      secondCosubmissionTitle: null,
    })
  })

  it('correctly calls parseCosubmissionInput over cosubmission data', () => {
    expect(parseInputToFormData({ cosubmission: ['hey', 'there'] })).toEqual({
      cosubmission: ['hey', 'there'],
      firstCosubmissionTitle: 'hey',
      secondCosubmissionTitle: 'there',
    })
  })

  it('correctly merges parsed information into cloned input object', () => {
    const mockInput = {
      name: 'Name',
      nested: {
        nest1: 'a',
        nest2: ['b', 'c'],
      },
      cosubmission: ['d', 'e'],
    }
    expect(parseInputToFormData(mockInput)).toEqual({
      name: 'Name',
      nested: {
        nest1: 'a',
        nest2: ['b', 'c'],
      },
      cosubmission: ['d', 'e'],
      firstCosubmissionTitle: 'd',
      secondCosubmissionTitle: 'e',
    })
  })
})

describe('parseTitleSuggestion', () => {
  it('correctly parses suggestions for the title field with the latest suggestion', () => {
    const mockInput = {
      something: 'arbitrary',
      meta: { title: '' },
      suggestions: [
        {
          fieldName: 'title',
          suggestions: [
            {
              score: 0,
              value: 'some wrong title',
            },
            {
              score: 1,
              value: 'some correct title',
            },
          ],
        },
      ],
    }

    expect(parseTitleSuggestion(mockInput)).toEqual({
      meta: { title: 'some correct title' },
    })
  })

  it("doesn't change a title if there's already something there", () => {
    const mockInput = {
      something: 'arbitrary',
      meta: { title: 'some existing title' },
      suggestions: [
        {
          fieldName: 'title',
          suggestions: [
            {
              score: 0,
              value: 'some wrong title',
            },
            {
              score: 1,
              value: 'some correct title',
            },
          ],
        },
      ],
    }

    expect(parseTitleSuggestion(mockInput)).toEqual({})
  })
})
