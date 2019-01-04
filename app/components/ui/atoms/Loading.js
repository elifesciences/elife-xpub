import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { th } from '@pubsweet/ui-toolkit'

const Spinner = styled.div`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  border-width: ${props => props.lineThickness}px;
  border-radius: 50%;
  border-style: solid;
  display: block;
  flex-shrink: 0;
  border-color: ${th('colorBorder')};
  border-top-color: ${th('colorPrimary')};
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-duration: 750ms;
  animation-name: rotating;
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const Loading = ({ size, lineThickness }) => (
  <Spinner lineThickness={lineThickness} size={size} />
)

Loading.propTypes = {
  size: PropTypes.number,
  lineThickness: PropTypes.number,
}

Loading.defaultProps = {
  size: 72,
  lineThickness: 4,
}
export default Loading
