import React from 'react'
import PropTypes from 'prop-types'

const Upload = props => {
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
              // stroke={color}
              cy="24"
              id="Oval"
              r="24"
              stroke="#E0E0E0"
              strokeWidth="3"
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

Upload.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

Upload.defaultProps = {
  color: 'currentColor',
  size: '24',
}

export default Upload
