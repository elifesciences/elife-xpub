import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import PropTypes from 'prop-types'

const StatusBox = styled(Box)`
  color: ${props => props.theme[props.color]};
  font-size: 13px;
`

const mapColor = statusCode =>
  ({
    CONTINUE_SUBMISION: 'colorText',
    WAITING_FOR_DECISION: 'colorTextSecondary',
    REJECTED: 'colorError',
  }[statusCode])

const getText = statusCode =>
  ({
    CONTINUE_SUBMISION: 'Continue Submision',
    WAITING_FOR_DECISION: 'Waiting for decision',
    REJECTED: 'Rejected',
  }[statusCode])

const ManuscriptStatus = ({ statusCode }) => (
  <StatusBox color={mapColor(statusCode)}>{getText(statusCode)}</StatusBox>
)

ManuscriptStatus.propTypes = {
  statusCode: PropTypes.string.isRequired,
}

export default ManuscriptStatus
