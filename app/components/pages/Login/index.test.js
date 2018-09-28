import React from 'react'
import { shallow } from 'enzyme'
import LoginPage from '.'

const clientMock = {
  mutate: jest.fn(() =>
    Promise.resolve({ data: { exchangeJournalToken: '345cba' } }),
  ),
}
const historyMock = { location: { hash: '#123abc' }, push: jest.fn() }

const makeWrapper = props => shallow(<LoginPage.WrappedComponent {...props} />)

describe('LoginPage component', () => {
  beforeEach(() => jest.clearAllMocks())

  it('does not redirect if no token', () => {
    const wrapper = makeWrapper()
    expect(wrapper.name()).not.toBe('Redirect')
  })

  it('redirects when a token is given', () => {
    const wrapper = makeWrapper({ client: clientMock, history: historyMock })
    expect(wrapper.name()).toBe('Redirect')
    expect(localStorage.getItem('token')).toBe('123abc')
  })

  it('saves exchanged token to storage', async () => {
    makeWrapper({ client: clientMock, history: historyMock })

    expect(localStorage.getItem('token')).toBe('123abc')
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
    expect(historyMock.push).toHaveBeenCalledWith('/login', { error: 'Nope' })
    expect(console.error).toHaveBeenCalled()
  })
})
