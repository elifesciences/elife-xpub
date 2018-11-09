import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'

import ManuscriptUpload from './ManuscriptUpload'

function makeCheerioWrapper(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <ManuscriptUpload onDrop={jest.fn()} {...props} />
      </MemoryRouter>
    </ThemeProvider>,
  )
    .render()
    .find('[data-test-id=dropzoneMessage]')
}

const manuscriptUpload = 'Upload your manuscript or drag it here.'
const noManuscriptError = 'Please upload your manuscript.'
const conversionFailure = 'Unable to upload manuscript.'
const manuscriptUploadSuccess = 'Success!'
const manuscriptUploading = 'Manuscript is uploading'

it('displays upload manuscript if nothing is set', () => {
  const dropzoneContentWrapper = makeCheerioWrapper()
  expect(dropzoneContentWrapper.text()).toContain(manuscriptUpload)
})

it('displays formError if set', () => {
  const dropzoneContentWrapper = makeCheerioWrapper({
    formError: noManuscriptError,
  })
  expect(dropzoneContentWrapper.text()).toContain(noManuscriptError)
})

it('displays fixed failure message if conversion.error is set', () => {
  const uploadError = new Error('Bad file type')
  const dropzoneContentWrapper = makeCheerioWrapper({
    conversion: { error: uploadError },
  })
  expect(dropzoneContentWrapper.text()).toContain(conversionFailure)
})

it('displays success if conversion.completed is set', () => {
  const dropzoneContentWrapper = makeCheerioWrapper({
    conversion: { completed: true },
  })
  expect(dropzoneContentWrapper.text()).toContain(manuscriptUploadSuccess)
})

// TODO fix this tests to account for upload %
it('displays uploading if conversion.converting is set', () => {
  const dropzoneContentWrapper = makeCheerioWrapper({
    conversion: { converting: true, progress: 10 },
  })
  // 'Manuscript is uploading'
  expect(dropzoneContentWrapper.text()).toBe(`${manuscriptUploading} 10%`)
})

// TODO fix these tests to account for upload %
it('displays uploading even if there are errors', () => {
  const dropzoneContentWrapper = makeCheerioWrapper({
    conversion: { converting: true, error: new Error('Boo'), progress: 15 },
    formError: noManuscriptError,
  })
  expect(dropzoneContentWrapper.text()).toBe(`${manuscriptUploading} 15%`)
})
