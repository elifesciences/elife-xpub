import React from 'react'
import { Box } from 'grid-styled'
import { Checkbox } from '@pubsweet/ui'

import CalloutBox from '../../../../ui/atoms/CalloutBox'

const OptionalSection = ({
  label,
  children,
  onClose,
  onOpen,
  open,
  namedAs,
}) => (
  <Box mb={4}>
    <Box mb={2}>
      <Checkbox
        checked={open}
        label={label}
        name={namedAs}
        onChange={open ? onClose : onOpen}
      />
    </Box>
    {!!open && <CalloutBox>{children}</CalloutBox>}
  </Box>
)

export default OptionalSection
