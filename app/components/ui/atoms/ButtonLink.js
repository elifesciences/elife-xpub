import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button } from '@pubsweet/ui'

const ButtonLink = ({ history, to, ...props }) => (
  <Button onClick={() => history.push(to)} {...props} />
)

export default withRouter(ButtonLink)
