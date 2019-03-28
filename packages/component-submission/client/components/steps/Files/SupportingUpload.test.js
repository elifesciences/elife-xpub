import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'
import SupportingUpload from './SupportingUpload'

const WrappedComponent = props => (
  <ThemeProvider theme={theme}>
    <MemoryRouter>
      <SupportingUpload onDrop={jest.fn()} {...props} />
    </MemoryRouter>
  </ThemeProvider>
)

const makeWrapper = props => mount(<WrappedComponent {...props} />)

describe('SupportingUpload', () => {
  it('Shows existing files from manuscript value', () => {
    const wrapper = makeWrapper({
      hasManuscript: true,
      files: [
        {
          filename: 'Foo.png',
          type: 'SUPPORTING_FILE',
        },
        {
          filename: 'Bar.png',
          type: 'SUPPORTING_FILE',
        },
      ],
    })
    expect(wrapper.find('[data-test-id="file-block-name"] span')).toHaveLength(
      2,
    )
  })
})
