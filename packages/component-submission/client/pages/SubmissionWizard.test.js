import { render } from '@testing-library/react'
import theme from '@elifesciences/elife-theme'
import React from 'react'
import 'jest-dom/extend-expect'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from 'react-apollo/test-utils'
import { SubmissionWizard } from './SubmissionWizard'

jest.mock('./AuthorStepPage', () => () => 'AuthorStepPage')
jest.mock('./FilesStepPage', () => () => 'FilesStepPage')
jest.mock('./DetailsStepPage', () => () => 'DetailsStepPage')
jest.mock('./EditorsStepPage', () => () => 'EditorsStepPage')
jest.mock('./DisclosureStepPage', () => () => 'DisclosureStepPage')

describe('SubmissionWizard', async () => {
  it('should display next on all steps except last one', () => {
    const props = {
      data: { manuscript: {} },
      match: { path: '/submit/id', url: '', params: { id: 'id' } },
      history: { location: { pathname: '/submit/id/files' } },
      updateManuscript: jest.fn(),
      submitManuscript: jest.fn(),
    }

    const setup = ({ children }) => (
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/submit/id/files']}>
          <MockedProvider>{children}</MockedProvider>
        </MemoryRouter>
      </ThemeProvider>
    )

    const opts = render(<SubmissionWizard {...props} />, { wrapper: setup })
    expect(opts.getByTestId('next')).toBeInTheDocument()

    // props.history.location.pathname = '/submit/id/files'
    // opts = render(<SubmissionWizard {...props} />, { wrapper: setup })
    // expect(opts.getByText(/FilesStepPage/)).toBeInTheDocument()
  })
})
