import React from 'react'
import { shallow } from 'enzyme'
import AutoSave from './AutoSave'

const makeWrapper = props =>
  shallow(<AutoSave onSave={jest.fn()} values={{ a: 1 }} {...props} />)
jest.useFakeTimers()

describe('AutoSave', () => {
  it('renders its children', () => {
    const wrapper = makeWrapper({ children: 'Some text' })
    expect(wrapper.text()).toContain('Some text')
  })

  it('does not save when values do not change', () => {
    const onSave = jest.fn()
    makeWrapper({ onSave })
    jest.advanceTimersByTime(6000)
    expect(onSave).not.toHaveBeenCalled()
  })

  it('does not save when disabled', () => {
    const onSave = jest.fn()
    const values = { a: 1 }
    const wrapper = makeWrapper({
      disabled: true,
      onSave,
      values,
      children: 'Some text',
    })
    wrapper.setProps({ values: { a: 2 } })
    jest.advanceTimersByTime(6000)
    expect(onSave).not.toHaveBeenCalled()
  })

  it('saves when values change', () => {
    const onSave = jest.fn()
    const values = { a: 1 }
    const wrapper = makeWrapper({ onSave, values, children: 'Some text' })
    wrapper.setProps({ values: { a: 2 } })
    jest.advanceTimersByTime(6000)
    expect(onSave).toHaveBeenCalled()
  })
})
