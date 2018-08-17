import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'

import FileUpload from './FileUpload'

function makeCheerioWrapper(props) {
  return mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <FileUpload onDrop={jest.fn()} {...props} />
      </MemoryRouter>
    </ThemeProvider>,
  )
    .render()
    .find('[data-test-id=dropzoneMessage]')
}

const manuscriptUpload = 'Upload your manuscript or drag it here.'
const noManuscriptError = 'Please upload your Manuscript.'
const badManuscriptError = 'Try to upload your Manuscript again.'
const manuscriptUploadSuccess = 'Success! Preview or replace your Manuscript.'
const manuscriptUploading = 'Manuscript is uploading'

it('displays upload manuscript if nothing is set', () => {
  const dropzoneContentWrapper = makeCheerioWrapper()
  expect(dropzoneContentWrapper.text()).toBe(manuscriptUpload)
})

it('displays error if formError is set', () => {
  const dropzoneContentWrapper = makeCheerioWrapper({ formError: true })
  expect(dropzoneContentWrapper.text()).toBe(noManuscriptError)
})

it('displays error if conversion.error is set', () => {
  const uploadError = new Error('Bad file type')
  const dropzoneContentWrapper = makeCheerioWrapper({
    conversion: { error: uploadError },
  })
  expect(dropzoneContentWrapper.text()).toBe(
    `${uploadError.message}. ${badManuscriptError}`,
  )
})

it('displays success if conversion.completed is set', () => {
  const dropzoneContentWrapper = makeCheerioWrapper({
    conversion: { completed: true },
  })
  expect(dropzoneContentWrapper.text()).toBe(manuscriptUploadSuccess)
})

// TODO fix this tests to account for upload %
it.skip('displays uploading if conversion.converting is set', () => {
  const dropzoneContentWrapper = makeCheerioWrapper({
    conversion: { converting: true },
  })
  expect(dropzoneContentWrapper.text()).toBe(manuscriptUploading)
})

// TODO fix these tests to account for upload %
it.skip('displays uploading even if there are errors', () => {
  const dropzoneContentWrapper = makeCheerioWrapper({
    conversion: { converting: true, error: new Error('Boo') },
    formError: true,
  })
  expect(dropzoneContentWrapper.text()).toBe(manuscriptUploading)
})
