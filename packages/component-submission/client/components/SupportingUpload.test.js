import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'
import { range } from 'lodash'
import SupportingUpload from './SupportingUpload'

const WrappedComponent = props => (
  <ThemeProvider theme={theme}>
    <MemoryRouter>
      <SupportingUpload onDrop={jest.fn()} {...props} />
    </MemoryRouter>
  </ThemeProvider>
)

const makeWrapper = props => mount(<WrappedComponent {...props} />)
const createFiles = count =>
  range(count).map(num => ({
    filename: `foo${num}.png`,
    type: 'SUPPORTING_FILE',
  }))

describe('SupportingUpload', () => {
  it('shows no text for "add" when no supporting files or manuscrip are uploaded', () => {
    const wrapper = makeWrapper({
      hasManuscript: false,
      files: [],
    })
    expect(
      wrapper.find('[data-test-id="supporting-files-upload-control"] > div'),
    ).toHaveLength(0)
  })

  it('Shows existing files from manuscript value', () => {
    const wrapper = makeWrapper({
      hasManuscript: true,
      files: createFiles(2),
    })
    expect(wrapper.find('[data-test-id="file-block-name"] span')).toHaveLength(
      2,
    )
  })

  it('shows the correct text for add (more) when supporting files exist', () => {
    let wrapper = makeWrapper({
      hasManuscript: true,
      files: [],
    })
    expect(
      wrapper
        .find('[data-test-id="supporting-files-upload-control"] > div')
        .text(),
    ).toEqual('Add  supporting files (optional)')

    wrapper = makeWrapper({
      hasManuscript: true,
      files: createFiles(1),
    })
    expect(
      wrapper
        .find('[data-test-id="supporting-files-upload-control"] > div')
        .text(),
    ).toEqual('Add more supporting files (optional)')
  })

  it('shows the correct validation text when more than 9 files are added', () => {
    const wrapper = makeWrapper({
      hasManuscript: true,
      files: createFiles(10),
    })
    expect(
      wrapper
        .find('[data-test-id="supporting-files-validation-text"] > div')
        .text(),
    ).toEqual('Maximum 10 supporting files')
  })

  it('Shows the "Add more supporting files (optional)" message when there are files but no manuscript', () => {
    const wrapper = makeWrapper({
      hasManuscript: false,
      files: createFiles(2),
    })
    expect(
      wrapper
        .find('[data-test-id="supporting-files-upload-control"] > div')
        .text(),
    ).toEqual('Add more supporting files (optional)')
  })
})
