import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'grid-styled'

import PodContainer from './PodContainer'
import Paragraph from '../atoms/Paragraph'

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
  isSelectButtonClickable: PropTypes.bool,
  togglePersonSelection: PropTypes.func.isRequired,
}

ChooserPod.defaultProps = {
  isSelectButtonClickable: true,
}

export default ChooserPod
