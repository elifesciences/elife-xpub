import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box } from 'grid-styled'

const TwoColumnLayout = ({ children, bottomSpacing, ...props }) => (
  <Flex flexWrap="wrap" mx={-2} {...props}>
    {children.map((item, index) => (
      <Box
        // try to use the key property of the React element
        key={item.key || index}
        mb={bottomSpacing ? 3 : 0}
        px={2}
        width={[1, 1, 1 / 2]}
      >
        {item}
      </Box>
    ))}
  </Flex>
)

TwoColumnLayout.propTypes = {
  /**
   * Elements to render in the layout.
   * If the items can change dynamically each element should have a `key` prop.
   */
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  /**
   * Set to false to disable bottom spacing on items.
   */
  bottomSpacing: PropTypes.bool,
}

TwoColumnLayout.defaultProps = {
  bottomSpacing: true,
}

export default TwoColumnLayout
