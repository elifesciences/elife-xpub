import React from 'react'
import { mount } from 'enzyme'
import { Formik } from 'formik'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'

import theme from '@elifesciences/elife-theme'
import EditorsPage from './EditorsPage'
import { schema } from './schema'

const formValues = {
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

function makeWrapper(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <Formik
          initialValues={formValues}
          onSubmit={jest.fn()}
          render={formProps => (
            <EditorsPage
              reviewingEditors={[]}
              seniorEditors={[]}
              {...formProps}
            />
          )}
          validationSchema={schema}
          {...props}
        />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

// TODO better tests
describe('EditorsPage component', () => {
  it('modals contents are initially hidden', () => {
    const wrapper = makeWrapper()
    expect(wrapper.find('PeoplePickerLogic')).toHaveLength(0)
  })

  it('shows exclusion box', () => {
    const wrapper = makeWrapper()
    wrapper
      .find('[data-test-id="opposed-senior-editors"] button')
      .simulate('click')
    wrapper.update()
    expect(wrapper.find('CalloutBox')).toHaveLength(1)
  })

  it('Adds a new suggested reviewer row when details are entered into the last current row', () => {
    const wrapper = makeWrapper()
    const suggestedReviewerInputs = () =>
      wrapper.find(
        '[data-test-id="suggestedReviewerInputGroup"] > TwoColumnLayout',
      )
    expect(suggestedReviewerInputs()).toHaveLength(1)
    suggestedReviewerInputs()
      .at(0)
      .find('input')
      .at(0)
      .simulate('change', {
        target: { name: 'suggestedReviewers.0.name', value: 'name' },
      })
    wrapper.update()
    expect(suggestedReviewerInputs()).toHaveLength(2)
  })

  it('Removes trailing suggested reviewer rows when cleared down', () => {
    const wrapper = makeWrapper()
    const suggestedReviewerInputs = () =>
      wrapper.find(
        '[data-test-id="suggestedReviewerInputGroup"] > TwoColumnLayout',
      )

    const enterSuggestedReviewerDetails = (index, value) => {
      suggestedReviewerInputs()
        .at(index)
        .find('input')
        .at(0)
        .simulate('change', {
          target: { name: `suggestedReviewers.${index}.name`, value },
        })
      wrapper.update()
    }

    expect(suggestedReviewerInputs()).toHaveLength(1)

    for (let lineNumber = 0; lineNumber < 3; lineNumber += 1) {
      enterSuggestedReviewerDetails(lineNumber, `name ${lineNumber}`)
    }

    expect(suggestedReviewerInputs()).toHaveLength(4)
    // remove not trailing reviewer details
    enterSuggestedReviewerDetails(1, '')
    enterSuggestedReviewerDetails(0, '')
    expect(suggestedReviewerInputs()).toHaveLength(4)

    // remove trailing reviewer detail
    enterSuggestedReviewerDetails(2, '')
    expect(suggestedReviewerInputs()).toHaveLength(1)
  })
})
