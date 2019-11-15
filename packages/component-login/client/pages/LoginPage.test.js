import React from 'react'
import { shallow } from 'enzyme'
import LoginPage from './LoginPage'

const clientMock = {
  mutate: jest.fn(() =>
    Promise.resolve({ data: { exchangeJournalToken: '345cba' } }),
  ),
}
const newSessionToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXctc2Vzc2lvbiI6dHJ1ZX0.hg60dL9UcboJ96XWUGne1V-e8rK_WmU0_fyxbEsNsCw'
const existingSessionToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXctc2Vzc2lvbiI6ZmFsc2V9.7h-6rCSKNPAFgzftRsyn96R_rP5kAG84e0DU2GKcsvI'
const historyMock = {
  location: { hash: `#${newSessionToken}` },
  push: jest.fn(),
}

const makeWrapper = props => shallow(<LoginPage.WrappedComponent {...props} />)

describe('LoginPage component', () => {
  beforeEach(() => jest.clearAllMocks())

  it('shows login page if no token', () => {
    const wrapper = makeWrapper()
    expect(wrapper.find('[data-test-id="login"]')).toHaveLength(1)
  })

  it('shows interstitial when token indicates an existing session', () => {
    const wrapper = makeWrapper({
      client: clientMock,
      history: {
        ...historyMock,
        location: { hash: `#${existingSessionToken}` },
      },
    })
    expect(wrapper.find('[data-test-id="continue"]')).toHaveLength(1)
    expect(localStorage.getItem('token')).toBe(existingSessionToken)
  })

  it('redirects when token indicates a new session', () => {
    const wrapper = makeWrapper({ client: clientMock, history: historyMock })
    expect(wrapper.name()).toBe('Redirect')
    expect(localStorage.getItem('token')).toBe(newSessionToken)
  })

  it('saves exchanged token to storage', async () => {
    makeWrapper({ client: clientMock, history: historyMock })

    expect(localStorage.getItem('token')).toBe(newSessionToken)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(localStorage.getItem('token')).toBe('345cba')
    expect(historyMock.push).not.toHaveBeenCalled()
  })

  it('redirects when token exchange fails', async () => {
    jest.spyOn(console, 'error').mockImplementationOnce(jest.fn())
    clientMock.mutate.mockImplementationOnce(() =>
      Promise.reject(new Error('Nope')),
    )
    makeWrapper({ client: clientMock, history: historyMock })

    await new Promise(resolve => setTimeout(resolve, 0))
    expect(historyMock.push).toHaveBeenCalledWith('/logout', { error: 'Nope' })
    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalled()
  })

  it('redirects when session expires', () => {
    jest.useFakeTimers()
    makeWrapper({ client: clientMock, history: historyMock })
    expect(historyMock.push).not.toBeCalled()
    jest.runAllTimers()
    expect(historyMock.push).toBeCalledWith('/logout')
  })
})
