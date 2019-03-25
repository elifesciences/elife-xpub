import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter, Route } from 'react-router-dom'
import ModalHistoryState from './ModalHistoryState'

describe('ModalHistoryState', () => {
  it('shows and hides a modal', () => {
    let childProps
    let history
    mount(
      <MemoryRouter>
        <ModalHistoryState>
          {props => {
            childProps = props
            return (
              <Route>
                {routerProps => {
                  history = routerProps.history
                  return false
                }}
              </Route>
            )
          }}
        </ModalHistoryState>
      </MemoryRouter>,
    )

    expect(history.entries).toMatchObject([{ pathname: '/', state: undefined }])
    expect(childProps.isModalVisible()).toBe(false)

    childProps.showModal()

    expect(history.entries).toMatchObject([
      { pathname: '/', state: undefined },
      { pathname: '/', state: { showModal: 'modal' } },
    ])
    expect(childProps.isModalVisible()).toBe(true)

    childProps.hideModal()

    expect(history.entries).toMatchObject([
      { pathname: '/', state: undefined },
      { pathname: '/', state: { showModal: 'modal' } },
    ])
    expect(childProps.isModalVisible()).toBe(false)
  })

  it('handles multiple modals', () => {
    let childProps1
    let childProps2
    let history
    mount(
      <MemoryRouter>
        <ModalHistoryState name="modal1">
          {props1 => {
            childProps1 = props1
            return (
              <ModalHistoryState name="modal2">
                {props2 => {
                  childProps2 = props2
                  return (
                    <Route>
                      {routerProps => {
                        history = routerProps.history
                        return false
                      }}
                    </Route>
                  )
                }}
              </ModalHistoryState>
            )
          }}
        </ModalHistoryState>
      </MemoryRouter>,
    )

    expect(childProps1.isModalVisible()).toBe(false)
    expect(childProps2.isModalVisible()).toBe(false)

    childProps1.showModal()

    expect(history.location).toMatchObject({
      pathname: '/',
      state: { showModal: 'modal1' },
    })
    expect(childProps1.isModalVisible()).toBe(true)
    expect(childProps2.isModalVisible()).toBe(false)

    childProps1.hideModal()

    expect(history.location).toMatchObject({ pathname: '/', state: undefined })
    expect(childProps1.isModalVisible()).toBe(false)
    expect(childProps2.isModalVisible()).toBe(false)

    childProps2.showModal()

    expect(history.location).toMatchObject({
      pathname: '/',
      state: { showModal: 'modal2' },
    })
    expect(childProps1.isModalVisible()).toBe(false)
    expect(childProps2.isModalVisible()).toBe(true)

    childProps2.hideModal()

    expect(history.location).toMatchObject({ pathname: '/', state: undefined })
    expect(childProps1.isModalVisible()).toBe(false)
    expect(childProps2.isModalVisible()).toBe(false)
  })
})
