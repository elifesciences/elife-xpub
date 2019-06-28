import parseFormToOutputData, {
  parseCosubmissionFormData,
  parseEditorSuggestionsData,
} from './parseFormToOutputData'

describe('parseCosubmissionFormData', () => {
  it('returns empty cosubmission array if passed an empty object', () => {
    expect(parseCosubmissionFormData({})).toEqual({ cosubmission: [] })
  })
  it('returns empty cosubmission array if firstCosubmissionTitle is null', () => {
    expect(parseCosubmissionFormData({ firstCosubmissionTitle: null })).toEqual(
      { cosubmission: [] },
    )
  })
  it('returns empty cosubmission array if firstCosubmissionTitle is null but secondCosubmissionTitle has a value', () => {
    expect(
      parseCosubmissionFormData({
        firstCosubmissionTitle: null,
        secondCosubmissionTitle: 'foo',
      }),
    ).toEqual({ cosubmission: [] })
  })
  it('returns cosubmission array with single value if only firstCosubmissionTitle has a value', () => {
    const { cosubmission } = parseCosubmissionFormData({
      firstCosubmissionTitle: 'bar',
      secondCosubmissionTitle: null,
    })
    expect(cosubmission).toHaveLength(1)
    expect(cosubmission[0]).toEqual('bar')
  })
  it('returns cosubmission array with values from firstCosubmissionTitle and secondCosubmissionTitle in correct order', () => {
    const { cosubmission } = parseCosubmissionFormData({
      firstCosubmissionTitle: 'bar',
      secondCosubmissionTitle: 'foo',
    })
    expect(cosubmission).toHaveLength(2)
    expect(cosubmission[0]).toEqual('bar')
    expect(cosubmission[1]).toEqual('foo')
  })
})

describe('parseEditorSuggestionsData', () => {
  it('maps people objects in editor fields to id arrays', () => {
    const values = {
      suggestedSeniorEditors: [
        { id: 1, name: 'Igor' },
        { id: 2, name: 'Ignatius' },
      ],
      opposedSeniorEditors: [{ id: 3 }],
      suggestedReviewingEditors: [{ id: 4 }],
      opposedReviewingEditors: [{ id: 5 }],
    }

    expect(parseEditorSuggestionsData(values)).toEqual({
      suggestedSeniorEditors: [1, 2],
      opposedSeniorEditors: [3],
      suggestedReviewingEditors: [4],
      opposedReviewingEditors: [5],
    })
  })
})

describe('parseFormToOutputData', () => {
  it('returns empty parsed object if passed empty object', () => {
    expect(parseFormToOutputData({})).toEqual({ cosubmission: [] })
  })
})
