/* eslint-disable import/first */
import { render, cleanup, fireEvent, configure } from '@testing-library/react'
import theme from '@elifesciences/elife-theme'
import React from 'react'
import 'jest-dom/extend-expect'
import flushPromises from 'flush-promises'
import config from 'config'
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

const makeProps = (path, pushHistory = jest.fn(), props) => ({
  data: { manuscript: { meta: {} } },
  match: { path: '/submit/id', url: '', params: { id: 'id' } },
  history: { location: { pathname: path }, push: pushHistory },
  updateManuscript: jest.fn(),
  submitManuscript: jest.fn(),
  ...props,
})

const renderWithPath = (path, pushHistory, props = {}) =>
  render(<SubmissionWizard {...makeProps(path, pushHistory, props)} />, {
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

  describe('submit', () => {
    describe('survey feature flag', () => {
      const path = '/submit/id/disclosure'
      const submitManuscript = jest.fn()
      const pushHistory = jest.fn()
      const originalFeatures = { ...config.features }

      afterEach(() => {
        config.features = originalFeatures
        submitManuscript.mockReset()
        pushHistory.mockReset()
      })

      it('should redirect to thank you if survey flag is off', async () => {
        config.features.demographicSurvey = false
        const { getByTestId, getByText } = renderWithPath(path, pushHistory, {
          submitManuscript,
        })

        fireEvent.click(getByTestId('submit'))
        await flushPromises()

        fireEvent.click(getByText('Confirm'))
        await flushPromises()

        expect(submitManuscript).toHaveBeenCalledTimes(1)
        expect(pushHistory).toHaveBeenCalledTimes(1)
        expect(pushHistory).toHaveBeenCalledWith('/thankyou/id')
      })

      it('should redirect to survey page if survey flag is on', async () => {
        config.features.demographicSurvey = true
        const { getByTestId, getByText } = renderWithPath(path, pushHistory, {
          submitManuscript,
        })

        fireEvent.click(getByTestId('submit'))
        await flushPromises()

        fireEvent.click(getByText('Confirm'))
        await flushPromises()

        expect(submitManuscript).toHaveBeenCalledTimes(1)
        expect(pushHistory).toHaveBeenCalledTimes(1)
        expect(pushHistory).toHaveBeenCalledWith('/survey/id')
      })
    })
  })

  describe('step navigation', () => {
    // eslint-disable-next-line no-console
    const consoleError = console.error
    const pushHistory = jest.fn()
    const scrollSpy = jest.spyOn(window, 'scrollTo')

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

    it('scrolls to top on next', async () => {
      const { getByTestId } = renderWithPath('/submit/id/author', pushHistory)

      expect(scrollSpy).toBeCalledTimes(0)

      fireEvent.click(getByTestId('next'))
      await flushPromises()

      expect(scrollSpy).toBeCalledTimes(1)
      expect(scrollSpy).toBeCalledWith(0, 0)
    })

    it('scrolls to top on back', async () => {
      const { getByTestId } = renderWithPath('/submit/id/files', pushHistory)

      expect(scrollSpy).toBeCalledTimes(0)

      fireEvent.click(getByTestId('back'))
      await flushPromises()

      expect(scrollSpy).toBeCalledTimes(1)
      expect(scrollSpy).toBeCalledWith(0, 0)
    })

    afterEach(() => {
      scrollSpy.mockClear()
    })

    afterAll(() => {
      // eslint-disable-next-line no-console
      console.error = consoleError
    })
  })

  describe('Step titles', () => {
    it('displays correct title on Author step', () => {
      expect(
        renderWithPath('/submit/id/author').getByText('Your details'),
      ).toBeInTheDocument()
    })
    it('displays correct title on Files step', () => {
      expect(
        renderWithPath('/submit/id/files').getByText('Your cover letter'),
      ).toBeInTheDocument()
    })
    it('displays correct title on Details step', () => {
      expect(
        renderWithPath('/submit/id/details').getByText(
          'Help us get your work seen by the right people',
        ),
      ).toBeInTheDocument()
    })
    it('displays correct title on Editors step', () => {
      expect(
        renderWithPath('/submit/id/editors').getByText(
          'Who should review your work?',
        ),
      ).toBeInTheDocument()
    })
    it('displays correct title on Disclosure step', () => {
      expect(
        renderWithPath('/submit/id/disclosure').getByText(
          'Disclosure of data to editors',
        ),
      ).toBeInTheDocument()
    })
  })
})
