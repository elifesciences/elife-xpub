import EditorSuggestionsModifier from './EditorSuggestionsModifier'

const modifier = new EditorSuggestionsModifier()

describe('EditorSuggestionsModifier', () => {
  it('maps people to IDs', () => {
    const values = {
      suggestedSeniorEditors: [
        { id: 1, name: 'Igor' },
        { id: 2, name: 'Ignatius' },
      ],
      opposedSeniorEditors: [{ id: 3 }],
      suggestedReviewingEditors: [{ id: 4 }],
      opposedReviewingEditors: [{ id: 5 }],
    }
    modifier.fromForm(values)
    expect(values).toEqual({
      suggestedSeniorEditors: [1, 2],
      opposedSeniorEditors: [3],
      suggestedReviewingEditors: [4],
      opposedReviewingEditors: [5],
    })
  })
})
