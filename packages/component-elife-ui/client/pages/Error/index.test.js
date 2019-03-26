import React from 'react'
import { mount } from 'enzyme'
import ErrorPage from '../Error'

describe('ErrorPage', () => {
  it('renders string', () => {
    const wrapper = mount(<ErrorPage error="Some error message" />)
    expect(wrapper.text()).toContain('Some error message')
  })

  it('renders Error object', () => {
    const wrapper = mount(<ErrorPage error={new Error('Another error')} />)
    expect(wrapper.text()).toContain('Another error')
  })

  it("doesn't choke on bad argument", () => {
    const wrapper = mount(<ErrorPage error={{}} />)
    expect(wrapper.text()).toContain('Back to homepage')
  })
})
