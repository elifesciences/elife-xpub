import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import PropTypes from 'prop-types'
import { th } from '@pubsweet/ui-toolkit'
import media from '../../global/layout/media'

const StatusBox = styled(Box)`
  color: ${props => props.theme[props.color]};
  font-size: ${th('size.7')};
  padding: 0px ${th('space.3')} ${th('space.3')} 0px;
  ${media.mobileUp`
    flex: 0 0 120px;
  `};
`

const mapColor = statusCode =>
  ({
    CONTINUE_SUBMISION: 'colorPrimary',
    WAITING_FOR_DECISION: 'colorPrimary',
    REJECTED: 'colorError',
  }[statusCode])

const getText = statusCode =>
  ({
    CONTINUE_SUBMISION: 'Continue Submision',
    WAITING_FOR_DECISION: 'Waiting for decision',
    REJECTED: 'Rejected',
  }[statusCode])

const ManuscriptStatus = ({ statusCode }) => (
  <StatusBox color={mapColor(statusCode)} data-test-id="status">
    {getText(statusCode)}
  </StatusBox>
)

ManuscriptStatus.propTypes = {
  statusCode: PropTypes.string.isRequired,
}

export default ManuscriptStatus
