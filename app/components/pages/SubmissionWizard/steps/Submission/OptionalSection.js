import React from 'react'
import { Box } from 'grid-styled'

import CalloutBox from '../../../../ui/atoms/CalloutBox'
import ControlledCheckbox from '../../../../ui/atoms/ControlledCheckbox'

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
      <ControlledCheckbox
        label={label}
        name={namedAs}
        onChange={open ? onClose : onOpen}
        value={open}
      />
    </Box>
    {!!open && <CalloutBox>{children}</CalloutBox>}
  </Box>
)

export default OptionalSection
