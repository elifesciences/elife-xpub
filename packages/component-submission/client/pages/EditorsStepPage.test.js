import React from 'react'
import { shallow } from 'enzyme'
import { EditorsStepPageComponent } from './EditorsStepPage'

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

  it('returns the correct boxVisibility state for the passed field name', () => {
    const wrapper = makeWrapper()
    expect(wrapper.instance().isBoxVisible('opposedSeniorEditors')).toBe(
      undefined,
    )
    wrapper.state().boxVisibility.opposedSeniorEditors = true
    expect(wrapper.instance().isBoxVisible('opposedSeniorEditors')).toBe(true)
  })

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
