import { render, cleanup, fireEvent, configure } from '@testing-library/react'
import React from 'react'
import flushPromises from 'flush-promises'
import theme from '@elifesciences/elife-theme'
import { ThemeProvider } from 'styled-components'
import { SurveyPage } from './SurveyPage'

const setupProvider = () => ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

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
})
