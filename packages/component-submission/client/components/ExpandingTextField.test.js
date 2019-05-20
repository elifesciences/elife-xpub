import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'

import ExpandingTextField from './ExpandingTextField'

describe('ExpandingTextField component', () => {
  it('Renders correctly with placeholder and label text displayed', () => {
    const labelText = 'this is a label'
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <ExpandingTextField
          label={labelText}
          maxRows={4}
          minRows={1}
          onChange={() => console.log('changed')}
          placeholder="PLACEHOLDER_TEXT"
          value="Something"
        />
      </ThemeProvider>,
    )

    const component = wrapper.find('label[data-test-id="expanding-label"]')

    expect(component).toHaveLength(1)
    expect(component.text()).toEqual(labelText)
  })

  // Note: The ExpandingTextField's expanding functionality relies on the browser's rendering of the `ScrollHeight`
  // property in the `textarea` component. enzyme's DOM rendering doesn't calculate this value so the component
  // simply won't work.
})
