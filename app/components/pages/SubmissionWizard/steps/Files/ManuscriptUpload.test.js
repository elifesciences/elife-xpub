import React from 'react'
import { mount, shallow } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'
import { errorMessageMapping } from './utils'

import ManuscriptUpload from './ManuscriptUpload'

const WrappedComponent = props => (
  <ThemeProvider theme={theme}>
    <MemoryRouter>
      <ManuscriptUpload onDrop={jest.fn()} {...props} />
    </MemoryRouter>
  </ThemeProvider>
)

const makeWrapper = props => mount(<WrappedComponent {...props} />)

const manuscriptUpload = 'Upload your manuscript or drag it here.'
const conversionFailure = 'There was a problem uploading your file.'
const manuscriptUploadSuccess = 'Success!'
const manuscriptUploading = 'Manuscript is uploading'

describe('ManuscriptUpload Content', () => {
  it('displays upload manuscript if nothing is set', () => {
    const wrapper = makeWrapper()
    expect(wrapper.find('ManuscriptUpload').text()).toContain(manuscriptUpload)
  })

  it('displays formError if set', () => {
    const wrapper = makeWrapper()
    wrapper.setProps({
      formError: errorMessageMapping.EMPTY,
    })
    wrapper.update()
    expect(wrapper.find('[data-test-conversion="failed"]').exists()).toEqual(
      true,
    )
    expect(wrapper.find('ManuscriptUpload').text()).toContain(
      errorMessageMapping.EMPTY,
    )
  })

  it('displays fixed failure message if conversion.error is set', () => {
    const uploadError = new Error('Bad file type')
    const wrapper = makeWrapper()
    wrapper.setProps({
      conversion: { error: uploadError },
    })

    wrapper.update()
    expect(wrapper.find('[data-test-conversion="failed"]').exists()).toEqual(
      true,
    )
    expect(wrapper.find('ManuscriptUpload').text()).toContain(conversionFailure)
  })

  it('displays success if conversion.completed is set', () => {
    const wrapper = makeWrapper()
    wrapper.setProps({
      conversion: { completed: true },
    })

    wrapper.update()
    expect(wrapper.find('[data-test-conversion="failed"]').exists()).toEqual(
      false,
    )
    expect(wrapper.find('[data-test-conversion="completed"]').exists()).toEqual(
      true,
    )
    expect(wrapper.find('ManuscriptUpload').text()).toContain(
      manuscriptUploadSuccess,
    )
  })

  it('displays uploading if conversion.converting is set', () => {
    const wrapper = makeWrapper()
    wrapper.setProps({
      conversion: { converting: true, progress: 10 },
    })

    wrapper.update()
    expect(wrapper.find('ManuscriptUpload').text()).toContain(
      `${manuscriptUploading} 10%`,
    )
    wrapper.setProps({
      conversion: { converting: true, progress: 100 },
    })
    wrapper.update()
    expect(wrapper.find('ManuscriptUpload').text()).toContain(
      `${manuscriptUploading} 100%`,
    )
  })
})

describe('ManuscriptUpload Component', () => {
  const makeShallowWrapper = () =>
    shallow(<ManuscriptUpload onDrop={jest.fn()} />)

  it('Maintain invalid file or server error message over field empty error', () => {
    const wrapper = makeShallowWrapper()
    const setEmptyError = () => {
      wrapper.setProps({
        formError: errorMessageMapping.EMPTY,
      })
      wrapper.update()
    }
    setEmptyError()
    // Ensure EMPTY shows when there are no other errors
    expect(wrapper.state('errorMessage')).toBe(errorMessageMapping.EMPTY)

    wrapper.setState({ errorMessage: errorMessageMapping.UNSUPPORTED })
    wrapper.update()
    expect(wrapper.state('errorMessage')).toBe(errorMessageMapping.UNSUPPORTED)
    setEmptyError()
    expect(wrapper.state('errorMessage')).toBe(errorMessageMapping.UNSUPPORTED)
    wrapper.setState({ errorMessage: errorMessageMapping.MULTIPLE })
    wrapper.update()
    expect(wrapper.state('errorMessage')).toBe(errorMessageMapping.MULTIPLE)
    setEmptyError()
    expect(wrapper.state('errorMessage')).toBe(errorMessageMapping.MULTIPLE)
  })
})
