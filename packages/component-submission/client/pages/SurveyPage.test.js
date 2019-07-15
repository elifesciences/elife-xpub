import { render, cleanup, fireEvent, configure } from '@testing-library/react'
import React from 'react'
import flushPromises from 'flush-promises'
import theme from '@elifesciences/elife-theme'
import { ThemeProvider } from 'styled-components'
import { SurveyPage } from './SurveyPage'

const setupProvider = () => ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

// List of question text for assertions
const questions = {
  question1: 'Country of residence of Last Author:',
  question2: 'Gender of Last Author:',
  question3: 'When did the Last Author become an independent researcher?',
}

const buildExpectedSubmitObject = (q1 = '', q2 = '', q3 = '') => ({
  variables: {
    data: {
      submissionId: 'foo',
      surveyId: 'demographicSurvey',
      answers: [
        {
          questionId: 'question1',
          text: questions.question1,
          answer: q1,
        },
        {
          questionId: 'question2',
          text: questions.question2,
          answer: q2,
        },
        {
          questionId: 'question3',
          text: questions.question3,
          answer: q3,
        },
      ],
    },
  },
})

describe('SurveyPage', async () => {
  beforeAll(() => configure({ testIdAttribute: 'data-test-id' }))
  afterEach(cleanup)

  it('submits survey when submit button is clicked', async () => {
    const mockSubmit = jest.fn(async () => {})
    const { getByTestId } = render(
      <SurveyPage
        history={[]}
        match={{ params: { id: 'foo ' } }}
        submitSurveyResponse={mockSubmit}
      />,
      {
        wrapper: setupProvider(),
      },
    )

    fireEvent.click(getByTestId('submit'))
    await flushPromises()

    expect(mockSubmit).toHaveBeenCalledTimes(1)
  })
  it('redirects to the thankyou page after submitting', async () => {
    const mockSubmit = jest.fn(async () => {})
    const mockHistory = { push: jest.fn() }
    const { push: mockPush } = mockHistory

    const { getByTestId } = render(
      <SurveyPage
        history={mockHistory}
        match={{ params: { id: 'foo' } }}
        submitSurveyResponse={mockSubmit}
      />,
      {
        wrapper: setupProvider(),
      },
    )

    fireEvent.click(getByTestId('submit'))
    await flushPromises()

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toBeCalledWith('/thankyou/foo')
  })

  it('displays Skip text on submit button if all inputs are empty', async () => {
    const mockSubmit = jest.fn(async () => {})

    const { getByTestId } = render(
      <SurveyPage
        history={[]}
        match={{ params: { id: 'foo' } }}
        submitSurveyResponse={mockSubmit}
      />,
      {
        wrapper: setupProvider(),
      },
    )
    expect(getByTestId('submit').textContent).toBe('Skip')

    fireEvent.click(getByTestId('submit'))
    await flushPromises()

    expect(mockSubmit).toBeCalledWith(buildExpectedSubmitObject())
  })
})
