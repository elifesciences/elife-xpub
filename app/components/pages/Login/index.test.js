import React from 'react'
import { shallow } from 'enzyme'
import LoginPage from '.'

const makeWrapper = props => shallow(<LoginPage {...props} />)

describe('LoginPage component', () => {
  it('does not redirect if no token', () => {
    const wrapper = makeWrapper()
    expect(wrapper.name()).not.toBe('Redirect')
  })

  it('redirects when a token is given', () => {
    const wrapper = makeWrapper({
      history: { location: { hash: '#123abc' } },
    })
    expect(wrapper.name()).toBe('Redirect')
    expect(localStorage.getItem('token')).toBe('123abc')
  })
})
