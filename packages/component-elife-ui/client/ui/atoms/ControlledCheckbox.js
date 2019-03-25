import React from 'react'

import { Checkbox } from '@pubsweet/ui'

const ControlledCheckbox = ({ value, ...props }) => (
  <Checkbox checked={!!value} {...props} />
)

export default ControlledCheckbox
