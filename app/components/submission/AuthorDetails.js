import React from 'react'

export default ({ value }) => (
  <div>
    <input disabled type="text" value={value.firstName} />
    <input disabled type="text" value={value.lastName} />
    <br />
    <input disabled type="text" value={value.email} />
    <input disabled type="text" value={value.institute} />
  </div>
)
