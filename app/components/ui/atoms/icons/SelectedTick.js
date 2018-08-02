import React from 'react'

const SelectedTick = props => (
  <svg height="1em" viewBox="0 0 36 36" width="1em" {...props}>
    <g fill="none" fillRule="evenodd">
      <circle
        className="selected-tick-circle"
        cx={18}
        cy={18}
        fill="#0288D1"
        r={18}
      />
      <path d="M15 22.2L10.8 18l-1.4 1.4L15 25l12-12-1.4-1.4z" fill="#FFF" />
    </g>
  </svg>
)

export default SelectedTick
