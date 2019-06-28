import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from '@rebass/grid'
import { Paragraph } from '@elifesciences/component-elife-ui/client/atoms'

import PodContainer from './PodContainer'

const ChooserPod = ({
  roleName,
  isRequired,
  isSelectButtonClickable = true,
  togglePersonSelection,
  ...props
}) => (
  <PodContainer
    isSelectButtonClickable
    selectButtonType="add"
    togglePersonSelection={togglePersonSelection}
  >
    <Flex flexDirection="column" justifyContent="center">
      <Box ml={2}>
        <Paragraph.Writing>
          Choose {roleName} ({isRequired ? 'required' : 'optional'})
        </Paragraph.Writing>
      </Box>
    </Flex>
  </PodContainer>
)

ChooserPod.propTypes = {
  roleName: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  isSelectButtonClickable: PropTypes.bool,
  togglePersonSelection: PropTypes.func.isRequired,
}

ChooserPod.defaultProps = {
  isSelectButtonClickable: true,
}

export default ChooserPod
