import React from 'react'
import { Route } from 'react-router-dom'

const ModalHistoryState = ({ children, name = 'modal' }) => (
  <Route>
    {({ history }) =>
      children({
        showModal: () => {
          history.push(history.location, { showModal: name })
        },

        hideModal: () => {
          history.goBack()
        },

        isModalVisible: () =>
          !!history.location.state && history.location.state.showModal === name,
      })
    }
  </Route>
)

export default ModalHistoryState
