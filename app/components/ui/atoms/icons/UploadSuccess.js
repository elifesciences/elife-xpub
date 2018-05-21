import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'

const UploadSuccess = props => {
  const { color, size, ...otherProps } = props
  return (
    <svg
      height={size}
      version="1.1"
      viewBox="0 0 52 52"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <title>dropzone-success</title>
      <defs />
      <g
        fill="none"
        fillRule="evenodd"
        id="Page-1"
        stroke="none"
        strokeWidth="1"
      >
        <g
          id="icons"
          stroke={otherProps.theme.colorPrimary}
          strokeWidth="3"
          transform="translate(-118.000000, -22.000000)"
        >
          <g id="dropzone-success" transform="translate(120.000000, 24.000000)">
            <polyline id="Path-2" points="16 24 21 29 32 18" />
            <circle cx="24" cy="24" id="Oval" r="24" />
          </g>
        </g>
      </g>
    </svg>
  )
}

UploadSuccess.propTypes = {
  color: PropTypes.string,
}

UploadSuccess.defaultProps = {
  color: 'currentColor',
}

export default withTheme(UploadSuccess)
