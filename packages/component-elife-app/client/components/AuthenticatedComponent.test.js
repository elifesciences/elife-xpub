import React from 'react'
import { render, cleanup } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import { MockedProvider } from 'react-apollo/test-utils'
import jwt from 'jsonwebtoken'
import { CURRENT_USER } from '../graphql/queries'
import AuthenticatedComponent from './AuthenticatedComponent'

jest.mock('@elifesciences/component-elife-ui/client/atoms/Loading', () => () =>
  'Loading',
)

const currentUserMock = data => [
  {
    request: {
      query: CURRENT_USER,
    },
    result: {
      data,
    },
  },
]

const makeWrapper = (currentUserMockResult = {}) =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <MockedProvider mocks={currentUserMock(currentUserMockResult)}>
        <Route exact path="/" render={() => <AuthenticatedComponent />} />
        <Route path="/login" render={() => 'Login'} />
      </MockedProvider>
    </MemoryRouter>,
  )

describe('AuthenticatedComponent', () => {
  afterEach(() => cleanup())

  it('redirects to login page if token is not present', () => {
    window.localStorage.removeItem('token')

    const { container } = makeWrapper()

    expect(container.textContent).toBe('Login')
  })

  it('redirects to login page if token is expired', () => {
    window.localStorage.setItem(
      'token',
      jwt.sign(
        {
          exp: Math.round(new Date().getTime() / 1000) - 10,
        },
        'secret key',
      ),
    )

    const { container } = makeWrapper()

    expect(container.textContent).toBe('Login')
  })

  it('redirects to login page if token is malformed', () => {
    window.localStorage.setItem('token', 'malformedtoken')

    const { container } = makeWrapper()

    expect(container.textContent).toBe('Login')
  })

  it('redirects to login page if no current user', async () => {
    window.localStorage.setItem(
      'token',
      jwt.sign(
        {
          exp: Math.round(new Date().getTime() / 1000) + 3600,
        },
        'secret key',
      ),
    )

    const { container } = makeWrapper(null)

    // await wait(0)
    await new Promise(resolve => {
      setTimeout(resolve, 0)
    })

    expect(container.textContent).toBe('Login')
  })
})
