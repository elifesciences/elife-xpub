import React from 'react'
import { Box } from '@rebass/grid'

import CalloutBox from '@elifesciences/component-elife-ui/client/atoms/CalloutBox'
import ControlledCheckbox from '@elifesciences/component-elife-ui/client/atoms/ControlledCheckbox'

const OptionalSection = ({
  label,
  children,
  onClose,
  onOpen,
  value,
  namedAs,
}) => (
  <Box mb={4}>
    <Box mb={2}>
      <ControlledCheckbox
        label={label}
        name={namedAs}
        onChange={value ? onClose : onOpen}
        value={value}
      />
    </Box>
    {!!value && <CalloutBox>{children}</CalloutBox>}
  </Box>
)

export default OptionalSection
