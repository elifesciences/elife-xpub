import React from 'react'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import SubmissionSave from './SubmissionSave'

jest.useFakeTimers()

const makeWrapper = props =>
  shallow(
    <SubmissionSave
      {...{
        disabled: false,
        handleSave: jest.fn(),
        values: { a: 1 },
        ...props,
      }}
    />,
  )

describe('SubmissionSave', () => {
  it('must not save when disabled', () => {
    const handleSave = jest.fn()
    const wrapper = makeWrapper({ handleSave, disabled: true })

    wrapper.setProps({ values: { a: 2 } })
    jest.runOnlyPendingTimers()
    expect(handleSave).not.toHaveBeenCalled()
  })

  it('must save when values change', () => {
    const handleSave = jest.fn(() => Promise.resolve())
    const wrapper = makeWrapper({ handleSave })

    wrapper.setProps({ values: { a: 2 } })
    jest.runOnlyPendingTimers()
    expect(handleSave).toHaveBeenCalledTimes(1)
    expect(handleSave.mock.calls[0]).toEqual([{ a: 2 }])
  })

  it('must not save when values do not change', () => {
    const handleSave = jest.fn()
    const wrapper = makeWrapper({ handleSave, disabled: true })

    wrapper.setProps({ values: { a: 1 } })
    jest.runOnlyPendingTimers()
    expect(handleSave).not.toHaveBeenCalled()
  })

  it('must not save when its still saving', () => {
    const handleSave = jest.fn(() => new Promise((resolve, reject) => {}))
    const wrapper = makeWrapper({ handleSave })

    wrapper.setProps({ values: { a: 2 } })
    jest.runOnlyPendingTimers()
    wrapper.setProps({ values: { a: 3 } })
    jest.runOnlyPendingTimers()

    expect(handleSave).toHaveBeenCalledTimes(1)
    expect(handleSave.mock.calls[0]).toEqual([{ a: 2 }])
  })

  it('must save after a successful save', async () => {
    const handleSave = jest.fn(() => Promise.resolve())
    const wrapper = makeWrapper({ handleSave })

    wrapper.setProps({ values: { a: 2 } })
    jest.runOnlyPendingTimers()
    await flushPromises()

    wrapper.setProps({ values: { a: 3 } })
    jest.runOnlyPendingTimers()
    await flushPromises()

    expect(handleSave).toHaveBeenCalledTimes(2)
    expect(handleSave.mock.calls[0]).toEqual([{ a: 2 }])
    expect(handleSave.mock.calls[1]).toEqual([{ a: 3 }])
  })

  it('must save after a failed save', async () => {
    const handleSave = jest.fn(() => Promise.reject())
    const wrapper = makeWrapper({ handleSave })

    wrapper.setProps({ values: { a: 2 } })
    jest.runOnlyPendingTimers()
    await flushPromises()

    wrapper.setProps({ values: { a: 3 } })
    jest.runOnlyPendingTimers()
    await flushPromises()

    expect(handleSave).toHaveBeenCalledTimes(2)
    expect(handleSave.mock.calls[0]).toEqual([{ a: 2 }])
    expect(handleSave.mock.calls[1]).toEqual([{ a: 3 }])
  })
})
