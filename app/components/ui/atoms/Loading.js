import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { colorBorder, colorPrimary } from '../../../../client/elife-theme/src'

const Spinner = styled.div`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  border-top: #0288d1;
  border-width: ${props => props.lineThinkess}px;
  border-radius: 50%;
  border-style: solid;
  display: block;
  flex-shrink: 0;
  border-color: ${colorPrimary};
  border-top-color: ${colorBorder};
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-duration: 750ms;
  animation-name: rotating @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const Loading = ({ size, lineThinkess }) => (
  <Spinner lineThinkess={lineThinkess} size={size} />
)

Loading.propTypes = {
  size: PropTypes.number,
  lineThinkess: PropTypes.number,
}

Loading.defaultProps = {
  size: 72,
  lineThinkess: 1,
}
export default Loading
