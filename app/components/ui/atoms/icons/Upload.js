import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

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

function percentageToDashoffset(percentage) {
  /**
   * convert from [0 - 100] to [250, 99]
   */
  const maxDashoffset = 250
  const minDashoffset = 99
  return (
    maxDashoffset -
    Math.min(Math.max(percentage, 0), 100) *
      (maxDashoffset - minDashoffset) /
      100
  )
}

const Upload = props => {
  const { color, size, percentage, ...otherProps } = props
  const progressCircle = percentageToDashoffset(percentage)
  let animate = true
  return (
    <AnimationRoot>
      <svg
        height={size}
        onClick={() => {
          animateUpload(animate)
          animate = !animate
        }}
        version="1.1"
        viewBox="0 0 52 52"
        width={size}
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
                fill="#0288D1"
                // fill={color}
                id="Shape"
                points="20 31 28 31 28 23 33 23 24 14 15 23 20 23"
              />
              <circle
                cx="24"
                cy="24"
                id="Oval"
                r="24"
                // stroke={color}
                stroke="#E0E0E0"
                strokeWidth="3"
              />
              <circle
                cx="24"
                cy="24"
                id="Progress-circle"
                r="24"
                stroke="#0288D1"
                strokeDasharray="250"
                strokeDashoffset={progressCircle}
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
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  percentage: PropTypes.number,
}

Upload.defaultProps = {
  color: 'currentColor',
  size: '24',
  percentage: 0,
}

export default Upload
