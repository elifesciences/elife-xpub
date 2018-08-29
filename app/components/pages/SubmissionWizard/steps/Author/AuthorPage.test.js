import React from 'react'
import { shallow } from 'enzyme'
import AuthorPage from './AuthorPage'

const makeWrapper = (props = {}) => shallow(<AuthorPage {...props} />)

describe('AuthorPage', () => {
  it('is not loading initially', () => {
    const wrapper = makeWrapper()
    expect(wrapper.text()).not.toContain('Loading')
  })

  it('displays loading message', () => {
    const wrapper = makeWrapper({ loading: true })
    expect(wrapper.text()).toContain('Loading')
  })

  it('displays error message', () => {
    const wrapper = makeWrapper({ error: 'Oh dang' })
    const errorWrapper = wrapper.find({ 'data-test-id': 'orcid-error' })
    expect(errorWrapper).toHaveLength(1)
    expect(errorWrapper.html()).toContain('Oh dang')
  })
})
