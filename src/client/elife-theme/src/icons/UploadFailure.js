import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'

const UploadFailure = props => {
  const { size, ...otherProps } = props
  return (
    <svg
      height={props.theme.space[size]}
      version="1.1"
      viewBox="0 0 52 52"
      width={props.theme.space[size]}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <title>dropzone-error</title>
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
          stroke={otherProps.theme.colorError}
          strokeWidth="3"
          transform="translate(-214.000000, -22.000000)"
        >
          <g id="dropzone-error" transform="translate(216.000000, 24.000000)">
            <path d="M17,31 L31,17" id="Path-2" />
            <path d="M31,31 L17,17" id="Path-2" />
            <circle cx="24" cy="24" id="Oval" r="24" />
          </g>
        </g>
      </g>
    </svg>
  )
}

UploadFailure.propTypes = {
  color: PropTypes.string,
}

UploadFailure.defaultProps = {
  color: 'currentColor',
}

export default withTheme(UploadFailure)
