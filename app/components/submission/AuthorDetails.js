import React from 'react'

export default ({ values, handleChange }) => (
  <div>
    <input
      name="firstName"
      onChange={handleChange}
      type="text"
      value={values.firstName}
    />
    <input
      name="lastName"
      onChange={handleChange}
      type="text"
      value={values.lastName}
    />
    <br />
    <input
      name="email"
      onChange={handleChange}
      type="text"
      value={values.email}
    />
    <input
      name="institute"
      onChange={handleChange}
      type="text"
      value={values.institute}
    />
  </div>
)
