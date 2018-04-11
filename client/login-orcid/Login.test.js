import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import Enzyme, { shallow } from 'enzyme'

import Login from './Login'

Enzyme.configure({ adapter: new Adapter() })

const makeWrapper = props => shallow(<Login {...props} />)

describe('ORCID Login component', () => {
  it('renders default button link', () => {
    const wrapper = makeWrapper()
    expect(wrapper.childAt(0).name()).toBe('Button')
  })

  it('renders custom content', () => {
    const wrapper = makeWrapper({ children: 'Boo' })
    expect(wrapper.text()).toBe('Boo')
  })

  it('redirects when a token is given', () => {
    global.localStorage = { setItem: jest.fn() }

    const wrapper = makeWrapper({
      location: { hash: '#123abc' },
    })
    expect(wrapper.name()).toBe('Redirect')
    expect(global.localStorage.setItem).toHaveBeenCalledWith('token', '123abc')
  })
})
