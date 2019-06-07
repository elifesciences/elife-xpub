import React from 'react'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import SubmissionSave from './SubmissionSave'

jest.useFakeTimers()

const makeWrapper = props =>
  shallow(
    <SubmissionSave
      disabled={false}
      onSave={jest.fn()}
      values={{ a: 1 }}
      {...props}
    />,
  )

describe('SubmissionSave', () => {
  it('must not save when disabled', () => {
    const onUpdate = jest.fn()
    const wrapper = makeWrapper({ onUpdate, disabled: true })

    wrapper.setProps({ values: { a: 2 } })
    jest.runOnlyPendingTimers()
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('must save when values change', () => {
    const onUpdate = jest.fn(() => Promise.resolve())
    const wrapper = makeWrapper({ onUpdate })

    wrapper.setProps({ values: { a: 2 } })
    jest.runOnlyPendingTimers()
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate.mock.calls[0]).toEqual([{ a: 2 }])
  })

  it('must not save when values do not change', () => {
    const onUpdate = jest.fn()
    const wrapper = makeWrapper({ onUpdate, disabled: true })

    wrapper.setProps({ values: { a: 1 } })
    jest.runOnlyPendingTimers()
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('must not save when its still saving', () => {
    const onUpdate = jest.fn(() => new Promise((resolve, reject) => {}))
    const wrapper = makeWrapper({ onUpdate })

    wrapper.setProps({ values: { a: 2 } })
    jest.runOnlyPendingTimers()
    wrapper.setProps({ values: { a: 3 } })
    jest.runOnlyPendingTimers()

    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate.mock.calls[0]).toEqual([{ a: 2 }])
  })

  it('must save after a successful save', async () => {
    const onUpdate = jest.fn(() => Promise.resolve())
    const wrapper = makeWrapper({ onUpdate })

    wrapper.setProps({ values: { a: 2 } })
    jest.runOnlyPendingTimers()
    await flushPromises()

    wrapper.setProps({ values: { a: 3 } })
    jest.runOnlyPendingTimers()
    await flushPromises()

    expect(onUpdate).toHaveBeenCalledTimes(2)
    expect(onUpdate.mock.calls[0]).toEqual([{ a: 2 }])
    expect(onUpdate.mock.calls[1]).toEqual([{ a: 3 }])
  })

  it('must save after a failed save', async () => {
    const onUpdate = jest.fn(() => Promise.reject())
    const wrapper = makeWrapper({ onUpdate })

    wrapper.setProps({ values: { a: 2 } })
    jest.runOnlyPendingTimers()
    await flushPromises()

    wrapper.setProps({ values: { a: 3 } })
    jest.runOnlyPendingTimers()
    await flushPromises()

    expect(onUpdate).toHaveBeenCalledTimes(2)
    expect(onUpdate.mock.calls[0]).toEqual([{ a: 2 }])
    expect(onUpdate.mock.calls[1]).toEqual([{ a: 3 }])
  })
})
