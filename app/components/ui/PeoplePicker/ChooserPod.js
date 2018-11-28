import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'grid-styled'

import PodContainer from './PodContainer'
import Paragraph from '../atoms/Paragraph'

const ChooserPod = ({
  roleName,
  isRequired,
  isSelectButtonClickable,
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
        <Paragraph>
          Choose {roleName} ({isRequired ? 'required' : 'optional'})
        </Paragraph>
      </Box>
    </Flex>
  </PodContainer>
)

ChooserPod.propTypes = {
  roleName: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  togglePersonSelection: PropTypes.func.isRequired,
}

export default ChooserPod
