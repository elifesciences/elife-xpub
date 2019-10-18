import React from 'react'

export default ({ src, style = { border: 0 }, height, width }) => (
  <div id="chart_embed_one">
    <iframe
      allowfullScreen
      frameBorder="0"
      height={height}
      src={src}
      style={style}
      title="Number of eLife submissions"
      width={width}
    />
  </div>
)
