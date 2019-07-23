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
  question1: "The group leader's country of residence:",
  question2: "The group leader's gender:",
  question3:
    'The year in which the group leader became an independent researcher (e.g., head of their own lab):',
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

const renderComponent = (mockSubmit = jest.fn(), mockHistory = []) =>
  render(
    <SurveyPage
      history={mockHistory}
      match={{ params: { id: 'foo' } }}
      submitSurveyResponse={mockSubmit}
    />,
    {
      wrapper: setupProvider(),
    },
  )

describe('SurveyPage', async () => {
  beforeAll(() => configure({ testIdAttribute: 'data-test-id' }))
  afterEach(cleanup)

  it('submits survey when submit button is clicked', async () => {
    const mockSubmit = jest.fn(async () => {})
    const { getByTestId } = renderComponent(mockSubmit)

    fireEvent.click(getByTestId('submit'))
    await flushPromises()

    expect(mockSubmit).toHaveBeenCalledTimes(1)
  })

  it('redirects to the thankyou page after submitting', async () => {
    const mockSubmit = jest.fn(async () => {})
    const mockHistory = { push: jest.fn() }
    const { push: mockPush } = mockHistory
    const { getByTestId } = renderComponent(mockSubmit, mockHistory)

    fireEvent.click(getByTestId('submit'))
    await flushPromises()

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toBeCalledWith('/thankyou/foo')
  })

  it('displays Skip text on submit button if all inputs are empty', async () => {
    const mockSubmit = jest.fn(async () => {})
    const { getByTestId } = renderComponent(mockSubmit)

    expect(getByTestId('submit').textContent).toBe('Skip')

    fireEvent.click(getByTestId('submit'))
    await flushPromises()

    expect(mockSubmit).toBeCalledWith(buildExpectedSubmitObject())
  })

  it('displays Done text on submit button when inputs are filled', async () => {
    const mockSubmit = jest.fn(async () => {})
    const { getByTestId } = renderComponent(mockSubmit)

    expect(getByTestId('submit').textContent).toBe('Skip')
    fireEvent.input(getByTestId('survey-question-1'), {
      target: { value: 'fooo' },
    })
    expect(getByTestId('submit').textContent).toBe('Done')
  })

  it('sends the answers when submitting', async () => {
    const mockSubmit = jest.fn(async () => {})
    const { getByTestId } = renderComponent(mockSubmit)

    fireEvent.input(getByTestId('survey-question-1'), {
      target: { value: 'answer 1' },
    })
    fireEvent.input(getByTestId('survey-question-2'), {
      target: { value: 'answer 2' },
    })
    fireEvent.input(getByTestId('survey-question-3'), {
      target: { value: 'answer 3' },
    })
    fireEvent.click(getByTestId('submit'))
    await flushPromises()

    expect(mockSubmit).toBeCalledWith(
      buildExpectedSubmitObject('answer 1', 'answer 2', 'answer 3'),
    )
  })

  it('renders the question text correctly', async () => {
    const { getByText } = renderComponent()

    expect(getByText(questions.question1)).toBeTruthy()
    expect(getByText(questions.question2)).toBeTruthy()
    expect(getByText(questions.question3)).toBeTruthy()
  })
})
