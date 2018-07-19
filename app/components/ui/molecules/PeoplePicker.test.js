import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import theme from '@elifesciences/elife-theme'
import PeoplePicker from './PeoplePicker'

const people = [
  { id: 1, name: 'Annie' },
  { id: 2, name: 'Bobby' },
  { id: 3, name: 'Chastity' },
  { id: 4, name: 'Dave' },
]

const makeWrapper = props =>
  mount(
    <ThemeProvider theme={theme}>
      <PeoplePicker
        // eslint-disable-next-line react/no-children-prop
        children={innerProps => <PeoplePicker.Body {...innerProps} />}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
        people={people}
        {...props}
      />
    </ThemeProvider>,
  )

const getPersonPodButton = (wrapper, index) =>
  wrapper.find('button[data-test-id="person-pod-toggle"]').at(index)

const expectSelectionLength = (wrapper, length) =>
  expect(wrapper.find('SelectedItem')).toHaveLength(length)

describe('PeoplePicker', () => {
  it('calls child render prop', () => {
    const render = jest.fn(() => null)
    makeWrapper({ children: render })
    expect(render).toHaveBeenCalled()
  })

  it('renders one person pod per person', () => {
    const wrapper = makeWrapper()
    const buttons = wrapper.find('PersonPod')

    expect(buttons).toHaveLength(4)
  })

  it('updates selection', () => {
    const wrapper = makeWrapper()
    expectSelectionLength(wrapper, 0)

    getPersonPodButton(wrapper, 0).simulate('click')
    expectSelectionLength(wrapper, 1)

    getPersonPodButton(wrapper, 0).simulate('click')
    expectSelectionLength(wrapper, 0)
  })

  it('disables inputs when maximum is reached', () => {
    const wrapper = makeWrapper({ maxSelection: 1 })
    expectSelectionLength(wrapper, 0)

    getPersonPodButton(wrapper, 0).simulate('click')
    expectSelectionLength(wrapper, 1)

    getPersonPodButton(wrapper, 1).simulate('click')
    expectSelectionLength(wrapper, 1)
  })

  it('allows submit only when minimum is met', () => {
    const onSubmit = jest.fn()
    const wrapper = makeWrapper({ minSelection: 1, onSubmit })

    wrapper
      .find('PeoplePicker')
      .instance()
      .handleSubmit()
    expect(onSubmit).not.toHaveBeenCalled()

    getPersonPodButton(wrapper, 0).simulate('click')
    wrapper
      .find('PeoplePicker')
      .instance()
      .handleSubmit()
    expect(onSubmit).toHaveBeenCalled()
  })

  it('shows selected items', () => {
    const wrapper = makeWrapper()
    expectSelectionLength(wrapper, 0)

    getPersonPodButton(wrapper, 0).simulate('click')
    expectSelectionLength(wrapper, 1)

    wrapper
      .find('SelectedItem')
      .find('svg')
      .simulate('click')
    expectSelectionLength(wrapper, 0)
  })
})
