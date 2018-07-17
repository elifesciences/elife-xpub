import React from 'react'
import { mount } from 'enzyme'
import { Formik } from 'formik'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import theme from '@elifesciences/elife-theme'
import ReviewerSuggestions from './ReviewerSuggestions'
import { empty, schema } from './ReviewerSuggestionsSchema'

function makeWrapper(props) {
  return mount(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <Formik
          component={ReviewerSuggestions}
          initialValues={empty}
          onSubmit={jest.fn()}
          validationSchema={schema}
          {...props}
        />
      </ThemeProvider>
    </MemoryRouter>,
  )
}

function countInputsMatching(wrapper, regex) {
  return wrapper
    .find('input')
    .filterWhere(node => node.prop('name').match(regex)).length
}

describe('ReviewerSuggestions component', () => {
  it('renders default form', () => {
    const wrapper = makeWrapper()
    expect(countInputsMatching(wrapper, /suggestedSeniorEditor/)).toBe(2)
    expect(countInputsMatching(wrapper, /suggestedReviewingEditor/)).toBe(2)
    expect(countInputsMatching(wrapper, /suggestedReviewer.+name/)).toBe(3)
  })

  it('adds excluded senior editor', () => {
    const wrapper = makeWrapper()
    expect(countInputsMatching(wrapper, /opposedSeniorEditor/)).toBe(0)
    wrapper
      .find('MoreButton')
      .at(0)
      .simulate('click')
    expect(countInputsMatching(wrapper, /opposedSeniorEditor/)).toBe(1)
  })
})
