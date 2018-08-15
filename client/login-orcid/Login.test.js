import React from 'react'
import { shallow } from 'enzyme'
import { Button } from '@pubsweet/ui'

import Login from './Login'

const makeWrapper = props => shallow(<Login {...props} />)

describe('ORCID Login component', () => {
  it('renders default button link', () => {
    const wrapper = makeWrapper()
    expect(wrapper.childAt(0).type()).toBe(Button)
  })

  it('renders custom content', () => {
    const wrapper = makeWrapper({ children: 'Boo' })
    expect(wrapper.text()).toBe('Boo')
  })

  it('redirects when a token is given', () => {
    const wrapper = makeWrapper({
      location: { hash: '#123abc' },
    })
    expect(wrapper.name()).toBe('Redirect')
    expect(localStorage.getItem('token')).toBe('123abc')
  })
})
