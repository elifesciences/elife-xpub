import { render, cleanup, fireEvent } from '@testing-library/react'
import theme from '@elifesciences/elife-theme'
import React from 'react'
import 'jest-dom/extend-expect'
import flushPromises from 'flush-promises'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from 'react-apollo/test-utils'
import { SubmissionWizard } from './SubmissionWizard'

jest.mock('react-ga')
jest.mock('./AuthorStepPage', () => () => 'AuthorStepPage')
jest.mock('./FilesStepPage', () => () => 'FilesStepPage')
jest.mock('./DetailsStepPage', () => () => 'DetailsStepPage')
jest.mock('./EditorsStepPage', () => () => 'EditorsStepPage')
jest.mock('./DisclosureStepPage', () => () => 'DisclosureStepPage')
jest.mock('../utils/ValidationSchemas', () => ({
  authorSchema: {},
  filesSchema: {},
  submissionSchema: {},
  editorsSchema: {},
  default: {},
}))

describe('SubmissionWizard', async () => {
  afterEach(cleanup)

  it('should display next on all steps except last one', async () => {
    const props = {
      data: { manuscript: {} },
      match: { path: '/submit/id', url: '', params: { id: 'id' } },
      history: { location: { pathname: '/submit/id/author' } },
      updateManuscript: jest.fn(),
      submitManuscript: jest.fn(),
    }

    const setup = (historyLocation = []) => ({ children }) => (
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={historyLocation}>
          <MockedProvider>{children}</MockedProvider>
        </MemoryRouter>
      </ThemeProvider>
    )

    const renderWithPath = path =>
      render(<SubmissionWizard {...props} />, { wrapper: setup([path]) })

    expect(
      renderWithPath('/submit/id/author').getByText(/Next/),
    ).toBeInTheDocument()
    cleanup()
    props.history.location.pathname = '/submit/id/files'
    expect(
      renderWithPath('/submit/id/files').getByText(/Next/),
    ).toBeInTheDocument()
    cleanup()
    props.history.location.pathname = '/submit/id/details'
    expect(
      renderWithPath('/submit/id/details').getByText(/Next/),
    ).toBeInTheDocument()
    cleanup()
    props.history.location.pathname = '/submit/id/editors'
    expect(
      renderWithPath('/submit/id/editors').getByText(/Next/),
    ).toBeInTheDocument()
    cleanup()
    props.history.location.pathname = '/submit/id/disclosure'
    expect(
      renderWithPath('/submit/id/disclosure').getByText(/Submit/),
    ).toBeInTheDocument()
  })

  it('displays the correct step for each given path', () => {
    const props = {
      data: { manuscript: {} },
      match: { path: '/submit/id', url: '', params: { id: 'id' } },
      history: { location: { pathname: '/submit/id/author' } },
      updateManuscript: jest.fn(),
      submitManuscript: jest.fn(),
    }

    const setup = (historyLocation = []) => ({ children }) => (
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={historyLocation}>
          <MockedProvider>{children}</MockedProvider>
        </MemoryRouter>
      </ThemeProvider>
    )

    const renderWithPath = path =>
      render(<SubmissionWizard {...props} />, { wrapper: setup([path]) })
    expect(
      renderWithPath('/submit/id/author').getAllByText('AuthorStepPage'),
    ).toBeTruthy()
    expect(
      renderWithPath('/submit/id/files').getAllByText('FilesStepPage'),
    ).toBeTruthy()
    expect(
      renderWithPath('/submit/id/details').getAllByText('DetailsStepPage'),
    ).toBeTruthy()
    expect(
      renderWithPath('/submit/id/editors').getAllByText('EditorsStepPage'),
    ).toBeTruthy()
    expect(
      renderWithPath('/submit/id/disclosure').getAllByText(
        'DisclosureStepPage',
      ),
    ).toBeTruthy()
  })

  it('should change the location on next', async () => {
    let opts = null
    const pushHistory = jest.fn()

    const makeProps = path => ({
      data: { manuscript: {} },
      match: { path: '/submit/id', url: '', params: { id: 'id' } },
      history: { location: { pathname: path }, push: pushHistory },
      updateManuscript: jest.fn(),
      submitManuscript: jest.fn(),
    })

    const setup = (historyLocation = []) => ({ children }) => (
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={historyLocation}>
          <MockedProvider>{children}</MockedProvider>
        </MemoryRouter>
      </ThemeProvider>
    )

    const renderWithPath = path =>
      render(<SubmissionWizard {...makeProps(path)} />, {
        wrapper: setup([path]),
      })

    // disable formik warnings
    // see https://stackoverflow.com/questions/55181009/jest-react-testing-library-warning-update-was-not-wrapped-in-act
    // eslint-disable-next-line no-console
    const consoleError = console.error
    // eslint-disable-next-line no-console
    console.error = (...args) => {
      if (
        args[0].startsWith(
          'Warning: An update to Formik inside a test was not wrapped in act(...).',
        )
      ) {
        consoleError(...args)
      }
    }

    opts = renderWithPath('/submit/id/author')
    fireEvent.click(opts.getByTestId('next'))
    await flushPromises()
    expect(pushHistory).toHaveBeenCalledTimes(1)
    expect(pushHistory.mock.calls[0]).toEqual(['/files'])
    cleanup()
    pushHistory.mockReset()

    opts = renderWithPath('/submit/id/files')
    fireEvent.click(opts.getByTestId('next'))
    await flushPromises()
    expect(pushHistory).toHaveBeenCalledTimes(1)
    expect(pushHistory.mock.calls[0]).toEqual(['/details'])
    cleanup()
    pushHistory.mockReset()

    opts = renderWithPath('/submit/id/details')
    fireEvent.click(opts.getByTestId('next'))
    await flushPromises()
    expect(pushHistory).toHaveBeenCalledTimes(1)
    expect(pushHistory.mock.calls[0]).toEqual(['/editors'])
    cleanup()
    pushHistory.mockReset()

    opts = renderWithPath('/submit/id/editors')
    fireEvent.click(opts.getByTestId('next'))
    await flushPromises()
    expect(pushHistory).toHaveBeenCalledTimes(1)
    expect(pushHistory.mock.calls[0]).toEqual(['/disclosure'])
    cleanup()
    pushHistory.mockReset()

    // eslint-disable-next-line no-console
    console.error = consoleError
  })
})
