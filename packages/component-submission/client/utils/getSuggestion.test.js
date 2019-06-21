import getSuggestion from './getSuggestion'

describe('getSuggestion', () => {
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

    expect(getSuggestion('title', mockInput)).toEqual('some correct title')
  })
})
