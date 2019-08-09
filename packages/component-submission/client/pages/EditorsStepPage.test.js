import React from 'react'
import { shallow } from 'enzyme'
import { EditorsStepPageComponent } from './EditorsStepPage'
import { EDITOR_LIMITS } from '../utils/constants'

function makeWrapper(valueOverrides, propOverrides) {
  const mockValues = {
    suggestedSeniorEditors: [
      {
        id: 1,
        name: 'Alfred Badger',
        aff: 'Institute of Badgers',
        focuses: ['cancer biology'],
        expertises: ['Neuroscience'],
      },
    ],
    opposedSeniorEditors: [],
    opposedSeniorEditorsReason: '',
    suggestedReviewingEditors: [],
    opposedReviewingEditors: [],
    opposedReviewingEditorsReason: '',
    suggestedReviewers: [{ name: '', email: '' }],
    opposedReviewers: [],
    opposedReviewersReason: '',
  }

  return shallow(
    <EditorsStepPageComponent
      {...{
        values: { ...mockValues, ...valueOverrides },
        errors: {},
        touched: {},
        setFieldTouched: jest.fn(),
        setFieldValue: jest.fn(),
        setFieldError: jest.fn(),
        reviewingEditors: [],
        seniorEditors: [],
        ...propOverrides,
      }}
    />,
  )
}

const getneratePerson = (id = 'id') => ({
  id,
  name: 'name',
  expertises: [],
  focuses: [],
})
const fakePerson = getneratePerson()

describe('EditorsPage component', () => {
  it('sets boxVisibility for opposed fields to be undefined when initialized if no opposedReviewer / editor data exists', () => {
    const wrapper = makeWrapper()
    expect(wrapper.state().boxVisibility).toEqual({
      opposedSeniorEditors: undefined,
      opposedReviewingEditors: undefined,
      opposedReviewers: undefined,
    })
  })
  it('sets boxVisibility for opposed fields to true if opposedReviewer / editor data exists', () => {
    let wrapper = makeWrapper({ opposedSeniorEditors: [fakePerson] })
    expect(wrapper.state().boxVisibility).toEqual({
      opposedSeniorEditors: true,
      opposedReviewingEditors: undefined,
      opposedReviewers: undefined,
    })
    wrapper = makeWrapper({
      opposedSeniorEditors: [fakePerson],
      opposedReviewingEditors: [fakePerson],
    })
    expect(wrapper.state().boxVisibility).toEqual({
      opposedSeniorEditors: true,
      opposedReviewingEditors: true,
      opposedReviewers: undefined,
    })
    wrapper = makeWrapper({
      opposedSeniorEditors: [fakePerson],
      opposedReviewingEditors: [fakePerson],
      opposedReviewers: [fakePerson],
    })
    expect(wrapper.state().boxVisibility).toEqual({
      opposedSeniorEditors: true,
      opposedReviewingEditors: true,
      opposedReviewers: true,
    })
  })
  describe('showBox', () => {
    it('updates the correct boxVisibility state value when showBox is called', () => {
      const wrapper = makeWrapper()
      expect(wrapper.state().boxVisibility.opposedSeniorEditors).toBe(undefined)
      wrapper.instance().showBox('opposedSeniorEditors')
      expect(wrapper.state().boxVisibility.opposedSeniorEditors).toBe(true)
      expect(wrapper.state().boxVisibility.opposedReviewingEditors).toBe(
        undefined,
      )
      wrapper.instance().showBox('opposedReviewingEditors')
      expect(wrapper.state().boxVisibility.opposedReviewingEditors).toBe(true)
    })
  })

  describe('hideBox', () => {
    it('updates the correct boxVisibility state value when hideBox is called', () => {
      const wrapper = makeWrapper()
      wrapper.instance().showBox('opposedSeniorEditors')
      expect(wrapper.state().boxVisibility.opposedSeniorEditors).toBe(true)
      wrapper.instance().hideBox('opposedSeniorEditors')
      expect(wrapper.state().boxVisibility.opposedSeniorEditors).toBe(false)
    })
    it('sets the passed field name value to an empty array when hideBox is called', () => {
      const mockSetFieldValue = jest.fn()
      const wrapper = makeWrapper(
        {
          opposedSeniorEditors: [fakePerson],
          opposedReviewingEditors: [fakePerson],
          opposedReviewers: [fakePerson],
        },
        { setFieldValue: mockSetFieldValue },
      )
      wrapper.instance().hideBox('opposedSeniorEditors')
      expect(mockSetFieldValue).toBeCalledWith('opposedSeniorEditors', [])
    })
  })
  describe('isBoxVisible', () => {
    it('returns the correct boxVisibility state for the passed field name', () => {
      const wrapper = makeWrapper()
      expect(wrapper.instance().isBoxVisible('opposedSeniorEditors')).toBe(
        undefined,
      )
      wrapper.state().boxVisibility.opposedSeniorEditors = true
      expect(wrapper.instance().isBoxVisible('opposedSeniorEditors')).toBe(true)
    })
  })
  describe('setSelection', () => {
    it('sets the field value and sets the field to touched when calling setSelection', () => {
      const mockSetFieldValue = jest.fn()
      const mockSetFieldTouched = jest.fn()
      const wrapper = makeWrapper(
        {
          opposedSeniorEditors: [fakePerson],
          opposedReviewingEditors: [fakePerson],
          opposedReviewers: [fakePerson],
        },
        {
          setFieldValue: mockSetFieldValue,
          setFieldTouched: mockSetFieldTouched,
        },
      )
      wrapper.instance().setSelection('foo', 'bar')
      expect(mockSetFieldValue).toBeCalledWith('foo', 'bar')
      expect(mockSetFieldTouched).toBeCalledWith('foo', true)
    })
  })
  describe('removeSelection', () => {
    it('sets a field value and sets the field to touched when calling removeSelection', () => {
      const mockSetFieldValue = jest.fn()
      const mockSetFieldTouched = jest.fn()
      const wrapper = makeWrapper(
        {
          opposedSeniorEditors: [fakePerson],
          opposedReviewingEditors: [fakePerson],
          opposedReviewers: [fakePerson],
        },
        {
          setFieldValue: mockSetFieldValue,
          setFieldTouched: mockSetFieldTouched,
        },
      )
      wrapper.instance().removeSelection('opposedSeniorEditors', {})
      expect(mockSetFieldValue.mock.calls[0]).toContain('opposedSeniorEditors')
      expect(mockSetFieldTouched).toBeCalledWith('opposedSeniorEditors', true)
    })
    it('filters the person object passed from the form files when called', () => {
      const mockSetFieldValue = jest.fn()
      const personToDelete = getneratePerson('c')
      const mockPeopleValues = [
        getneratePerson('a'),
        getneratePerson('b'),
        personToDelete,
        getneratePerson('d'),
      ]
      const wrapper = makeWrapper(
        { opposedSeniorEditors: mockPeopleValues },
        { setFieldValue: mockSetFieldValue },
      )
      wrapper.instance().removeSelection('opposedSeniorEditors', personToDelete)
      expect(mockSetFieldValue).toBeCalledWith('opposedSeniorEditors', [
        getneratePerson('a'),
        getneratePerson('b'),
        getneratePerson('d'),
      ])
    })
  })

  describe('suggestedReviewerItemIsBlank', () => {
    it('returns true when passed an object with empty name and email', () => {
      const wrapper = makeWrapper()
      expect(
        wrapper
          .instance()
          .suggestedReviewerItemIsBlank({ email: '', name: '' }),
      ).toBe(true)
    })
    it('returns false when passed an object with a name or email value', () => {
      const wrapper = makeWrapper()
      expect(
        wrapper
          .instance()
          .suggestedReviewerItemIsBlank({ email: 'email@email.com', name: '' }),
      ).toBe(false)
      expect(
        wrapper
          .instance()
          .suggestedReviewerItemIsBlank({ email: '', name: 'name' }),
      ).toBe(false)
      expect(
        wrapper.instance().suggestedReviewerItemIsBlank({
          email: 'email@email.com',
          name: 'name',
        }),
      ).toBe(false)
    })
  })
  describe('getTrailingBlankReviewerCount', () => {
    it('returns 0 when none of the reviewers are blank', () => {
      const mockReviewers = [
        { name: 'name', email: 'email' },
        { name: 'name2', email: 'email2' },
      ]
      const wrapper = makeWrapper()
      expect(
        wrapper.instance().getTrailingBlankReviewerCount(mockReviewers),
      ).toBe(0)
    })
    it('returns the correct count of blank reviewer rows', () => {
      const mockReviewers = [
        { name: 'name', email: 'email' },
        { name: '', email: '' },
      ]
      const wrapper = makeWrapper()
      expect(
        wrapper.instance().getTrailingBlankReviewerCount(mockReviewers),
      ).toBe(1)
      mockReviewers.push({ name: '', email: '' })
      expect(
        wrapper.instance().getTrailingBlankReviewerCount(mockReviewers),
      ).toBe(2)
    })
  })
  describe('calculateNewSuggestedReviewersFieldValue', () => {
    it('returns unchanged if there is already a blank row', () => {
      const mockReviewers = [
        { name: 'name', email: 'email' },
        { name: '', email: '' },
      ]
      const wrapper = makeWrapper()
      expect(
        wrapper
          .instance()
          .calculateNewSuggestedReviewersFieldValue(mockReviewers),
      ).toEqual(mockReviewers)
    })
    it('returns with an extra blank reviewer if max reviewers is not met', () => {
      const mockReviewers = [
        { name: 'name', email: 'email' },
        { name: 'name', email: 'email' },
      ]
      const wrapper = makeWrapper()
      expect(
        wrapper
          .instance()
          .calculateNewSuggestedReviewersFieldValue(mockReviewers, 3, 0),
      ).toHaveLength(3)
      expect(
        wrapper
          .instance()
          .calculateNewSuggestedReviewersFieldValue(mockReviewers, 3, 0)[2],
      ).toEqual({ name: '', email: '' })
    })
    it('returns unchanged if max reviewers is met', () => {
      const mockReviewers = []
      do {
        mockReviewers.push({ name: 'name', email: 'email' })
      } while (mockReviewers.length !== EDITOR_LIMITS.suggestedReviewers.max)
      expect(mockReviewers).toHaveLength(EDITOR_LIMITS.suggestedReviewers.max)
      const wrapper = makeWrapper()
      expect(
        wrapper
          .instance()
          .calculateNewSuggestedReviewersFieldValue(
            mockReviewers,
            EDITOR_LIMITS.suggestedReviewers.max,
            EDITOR_LIMITS.suggestedReviewers.min,
          ),
      ).toEqual(mockReviewers)
    })
    it('returns min + 1 row if passed empty reviewers array', () => {
      const wrapper = makeWrapper()
      expect(
        wrapper
          .instance()
          .calculateNewSuggestedReviewersFieldValue(
            [],
            EDITOR_LIMITS.suggestedReviewers.max,
            EDITOR_LIMITS.suggestedReviewers.min,
          ),
      ).toHaveLength(EDITOR_LIMITS.suggestedReviewers.min + 1)
    })
  })
  describe('filterEditors', () => {
    it('filters editors with the same ids as passed in the filter array', () => {
      const wrapper = makeWrapper()
      const editors = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
      const toFilter = [{ id: 'a' }, { id: 'c' }]
      expect(wrapper.instance().filterEditors(editors, toFilter)).toEqual([
        { id: 'b' },
      ])
    })
  })
})
