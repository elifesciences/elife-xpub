import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'

const EmptyListMessage = styled(Box)`
  text-align: center;
  color: ${th('colorTextSecondary')};
`

const ArchivedPanel = ({ manuscripts }) => (
  <EmptyListMessage mt={7}>
    {manuscripts.length ? null : 'You currently have no archived submissions'}
  </EmptyListMessage>
)

ArchivedPanel.propTypes = {
  manuscripts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      meta: PropTypes.shape({
        title: PropTypes.string,
      }).isRequired,
    }),
  ),
}

ArchivedPanel.defaultProps = {
  manuscripts: [],
}

export default ArchivedPanel
