import React from 'react'

const RubbishBin = props => (
  <svg
    className="rubbish-bin"
    fill="#888"
    fillRule="evenodd"
    height="1em"
    viewBox="0 0 14 18"
    width="1em"
    {...props}
  >
    <path d="M1 16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4H1v12zM14 1h-3.5l-1-1h-5l-1 1H0v2h14V1z" />
  </svg>
)

export default RubbishBin
