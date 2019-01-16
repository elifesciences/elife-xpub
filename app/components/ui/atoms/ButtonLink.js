import React from 'react'
import { withRouter } from 'react-router-dom'
import ButtonBase from './ButtonBase'

const ButtonLink = ({ history, to, ...props }) => (
  <ButtonBase onClick={() => history.push(to)} {...props} />
)

export default withRouter(ButtonLink)
