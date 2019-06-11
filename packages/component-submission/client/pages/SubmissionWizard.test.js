import { render } from '@testing-library/react'
import theme from '@elifesciences/elife-theme'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from 'react-apollo/test-utils'
import { SubmissionWizard } from './SubmissionWizard'

describe('SubmissionWizard', async () => {
  const mockMatch = {
    url: '',
    params: { id: '' },
    path: '',
  }

  it('renders the form', async () => {
    const mockUpdate = jest.fn()
    const props = {
      match: mockMatch,
      updateManuscript: mockUpdate,
      history: { location: { pathname: '/submit/id/step' } },
      initialValues: { fileStatus: 'READY' },
      data: { manuscript: {} },
    }

    const { getByTestId, container } = render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <MockedProvider>
            <SubmissionWizard {...props} />
          </MockedProvider>
        </MemoryRouter>
      </ThemeProvider>,
    )

    const form = getByTestId('submission-wizard-form')

    expect(form).toBeTruthy()
    expect(container).toMatchSnapshot()
  })

  // it('enables autosave when a file is finished uploading', async () => {
  //   const mockUpdate = jest.fn()
  //   const props = {
  //     match: mockMatch,
  //     updateManuscript: mockUpdate,
  //     history: jest.fn(),
  //     initialValues: { fileStatus: 'READY' },
  //   }

  //   const thing = shallow(<SubmissionWizard {...props} />)

  //   expect(thing.instance().state.isUploading).toBe(false)
  //   expect(thing.instance().state.suspendSave).toBe(false)

  //   thing.instance().setIsUploading(true)

  //   expect(mockUpdate).toHaveBeenCalledTimes(0)
  //   thing.instance().setIsUploading(false)

  //   thing.instance().onNextClick({ submitted_should_be: false })
  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  // })

  // it('Keeps and retries the latest save when disabled', async () => {
  //   const mockUpdate = jest.fn()
  //   const props = {
  //     match: mockMatch,
  //     updateManuscript: mockUpdate,
  //     history: jest.fn(),
  //     initialValues: { fileStatus: 'READY' },
  //   }

  //   const thing = shallow(<SubmissionWizard {...props} />)

  //   expect(thing.instance().state.isUploading).toBe(false)
  //   expect(thing.instance().state.suspendSave).toBe(false)

  //   thing.instance().setIsUploading(true)

  //   expect(mockUpdate).toHaveBeenCalledTimes(0)

  //   thing.instance().onNextClick({ submitted_should_be: false })
  //   thing.instance().setIsUploading(false)

  //   expect(mockUpdate).toHaveBeenCalledTimes(1)
  //   expect(mockUpdate.mock.calls).toEqual([[{ submitted_should_be: false }]])
  //   expect(thing.instance().state.nextSaveValues).toBeNull()
  // })

  // it('disables the autosave on submit and re-enables it on completion', async () => {
  //   const mockUpdate = jest.fn()
  //   const mockSubmit = jest.fn(() =>
  //     new Promise(resolve => {
  //       expect(thing.instance().state.suspendSave).toBe(true)
  //       resolve()
  //     }).catch(err => {
  //       // eslint-disable-next-line no-undef
  //       fail(err)
  //     }),
  //   )
  //   const props = {
  //     match: mockMatch,
  //     updateManuscript: mockUpdate,
  //     submitManuscript: mockSubmit,
  //     history: jest.fn(),
  //     initialValues: { fileStatus: 'READY' },
  //   }

  //   const thing = shallow(<SubmissionWizard {...props} />)

  //   expect(thing.instance().state.isUploading).toBe(false)
  //   expect(thing.instance().state.suspendSave).toBe(false)
  //   // Not testing that suspendSacve has changed back to false becuase of promise issues
  //   thing.instance().onSubmitManuscript({ prop: 'key' })
  //   expect(mockSubmit).toHaveBeenCalledTimes(1)
  // })
})
