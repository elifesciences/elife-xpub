import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'grid-styled'

import PersonPodContainer from './PersonPodContainer'
import Paragraph from './Paragraph'

const ChooserPod = ({
  roleName,
  isRequired,
  isSelectButtonClickable,
  togglePersonSelection,
  ...props
}) => (
  <PersonPodContainer
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
  </PersonPodContainer>
)

ChooserPod.propTypes = {
  roleName: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  togglePersonSelection: PropTypes.func.isRequired,
}

export default ChooserPod
