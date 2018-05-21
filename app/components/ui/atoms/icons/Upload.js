import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes, withTheme } from 'styled-components'

function animateUpload(animate) {
  if (animate === true) {
    document.getElementById('Progress-circle').style.animationPlayState =
      'running'
  } else {
    document.getElementById('Progress-circle').style.animationPlayState =
      'paused'
  }
}

const uploadingAnimation = keyframes`
  from {
    stroke-dashoffset: 250;
  }
  to {
    stroke-dashoffset: 99;
  }
`

const AnimationRoot = styled.div`
  #Progress-circle-TODO {
    animation: ${uploadingAnimation} 5s linear paused;
  }
`

function percentageToDasharray(percentage, circleRadius) {
  /**
   * converts from [0 - 100] to stroke-dasharray string
   * with pairs of numbers like "150.72, 0" etc
   */
  const circleLength = 2 * Math.PI * circleRadius
  const lineLength = circleLength * percentage / 100
  const spaceLength = circleLength - lineLength
  return `${lineLength}, ${spaceLength}`
}

const Upload = ({ color, percentage, ...otherProps }) => {
  const dashArray = percentageToDasharray(percentage, 24)
  let animate = true
  return (
    <AnimationRoot>
      <svg
        onClick={() => {
          animateUpload(animate)
          animate = !animate
        }}
        version="1.1"
        viewBox="0 0 52 52"
        xmlns="http://www.w3.org/2000/svg"
        {...otherProps}
      >
        <title>dropzone-upload</title>
        <defs />
        <g
          fill="none"
          fillRule="evenodd"
          id="Page-1"
          stroke="none"
          strokeWidth="1"
        >
          <g id="icons" transform="translate(-22.000000, -22.000000)">
            <g id="dropzone-upload" transform="translate(24.000000, 24.000000)">
              <polygon
                fill={otherProps.theme.colorPrimary}
                id="Shape"
                points="20 31 28 31 28 23 33 23 24 14 15 23 20 23"
              />
              <circle
                cx="24"
                cy="24"
                id="Oval"
                r="24"
                stroke={otherProps.theme.colorFurniture}
                strokeWidth="3"
              />
              <circle
                cx="24"
                cy="24"
                id="Progress-circle"
                r="24"
                stroke={otherProps.theme.colorPrimary}
                strokeDasharray={dashArray}
                strokeWidth="2"
              />
            </g>
          </g>
        </g>
      </svg>
    </AnimationRoot>
  )
}

Upload.propTypes = {
  color: PropTypes.string,
  percentage: PropTypes.number,
}

Upload.defaultProps = {
  color: 'currentColor',
  percentage: 0,
}

export default withTheme(Upload)
