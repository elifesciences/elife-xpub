import { render, cleanup, fireEvent, configure } from '@testing-library/react'
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

// needs extracting to own file #2126
const setupProvider = (historyLocation = []) => ({ children }) => (
  <ThemeProvider theme={theme}>
    <MemoryRouter initialEntries={historyLocation}>
      <MockedProvider>{children}</MockedProvider>
    </MemoryRouter>
  </ThemeProvider>
)

const makeProps = (path, pushHistory = jest.fn()) => ({
  data: { manuscript: {} },
  match: { path: '/submit/id', url: '', params: { id: 'id' } },
  history: { location: { pathname: path }, push: pushHistory },
  updateManuscript: jest.fn(),
  submitManuscript: jest.fn(),
})

const renderWithPath = (path, pushHistory) =>
  render(<SubmissionWizard {...makeProps(path, pushHistory)} />, {
    wrapper: setupProvider([path]),
  })

describe('SubmissionWizard', async () => {
  beforeAll(() => configure({ testIdAttribute: 'data-test-id' }))
  afterEach(cleanup)

  it('should display next on all steps except last one', async () => {
    expect(
      renderWithPath('/submit/id/author').getByText(/Next/),
    ).toBeInTheDocument()
    cleanup()
    expect(
      renderWithPath('/submit/id/files').getByText(/Next/),
    ).toBeInTheDocument()
    cleanup()
    expect(
      renderWithPath('/submit/id/details').getByText(/Next/),
    ).toBeInTheDocument()
    cleanup()
    expect(
      renderWithPath('/submit/id/editors').getByText(/Next/),
    ).toBeInTheDocument()
    cleanup()
    expect(
      renderWithPath('/submit/id/disclosure').getByText(/Submit/),
    ).toBeInTheDocument()
  })

  it('displays the correct step for each given path', () => {
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

  describe('step navigation', () => {
    // eslint-disable-next-line no-console
    const consoleError = console.error
    const pushHistory = jest.fn()

    const testStepNavigation = async (currentPath, nextStep, buttonId) => {
      const opts = renderWithPath(currentPath, pushHistory)
      fireEvent.click(opts.getByTestId(buttonId))
      await flushPromises()
      expect(pushHistory).toHaveBeenCalledTimes(1)
      expect(pushHistory.mock.calls[0]).toEqual([nextStep])
      cleanup()
      pushHistory.mockReset()
    }

    const SUPPRESSED_PREFIXES = [
      'Warning: Do not await the result of calling ReactTestUtils.act(...)',
      'Warning: An update to %s inside a test was not wrapped in act(...)',
    ]

    beforeAll(() => {
      // disable formik warnings
      // see https://stackoverflow.com/questions/55181009/jest-react-testing-library-warning-update-was-not-wrapped-in-act
      // https://github.com/facebook/react/pull/14853 removes the need for this once we upgrade to react-dom 16.9
      // eslint-disable-next-line no-console
      console.error = (...args) => {
        if (!SUPPRESSED_PREFIXES.some(sp => args[0].startsWith(sp))) {
          consoleError(...args)
        }
      }
    })

    it('should change the location on next', async () => {
      await testStepNavigation('/submit/id/author', '/files', 'next')
      await testStepNavigation('/submit/id/files', '/details', 'next')
      await testStepNavigation('/submit/id/details', '/editors', 'next')
      await testStepNavigation('/submit/id/editors', '/disclosure', 'next')
    })

    it('should change the location on back except on first step', async () => {
      const opts = renderWithPath('/submit/id/author')
      fireEvent.click(opts.getByTestId('back'))
      await flushPromises()
      expect(pushHistory).toHaveBeenCalledTimes(0)
      cleanup()
      pushHistory.mockReset()

      await testStepNavigation('/submit/id/files', '/author', 'back')
      await testStepNavigation('/submit/id/details', '/files', 'back')
      await testStepNavigation('/submit/id/editors', '/details', 'back')
      await testStepNavigation('/submit/id/disclosure', '/editors', 'back')
    })

    afterAll(() => {
      // eslint-disable-next-line no-console
      console.error = consoleError
    })
  })
})
