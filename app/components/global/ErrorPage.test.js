import React from 'react'
import { mount } from 'enzyme'
import ErrorPage from './ErrorPage'

describe('ErrorPage', () => {
  it('renders string', () => {
    const wrapper = mount(<ErrorPage error="Some error message" />)
    expect(wrapper.text()).toContain('Some error message')
  })

  it('renders Error object', () => {
    const wrapper = mount(<ErrorPage error={new Error('Another error')} />)
    expect(wrapper.text()).toContain('Another error')
  })
})
