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
    expect(
      wrapper.find('[data-test-id="suggestedReviewerInputGroup"]'),
    ).toHaveLength(1)
    wrapper
      .find('[data-test-id="suggestedReviewerInputGroup"]')
      .at(0)
      .find('input')
      .at(0)
      .simulate('change', {
        target: { name: 'suggestedReviewers.0.name', value: 'name' },
      })
    wrapper.update()
    expect(
      wrapper.find('[data-test-id="suggestedReviewerInputGroup"]'),
    ).toHaveLength(2)
  })
})
