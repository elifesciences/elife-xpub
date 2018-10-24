import React from 'react'
import PropType from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const StaffImg = styled.img`
  height: 280px;
  max-width: 100%;
  outline: 1px solid #e0e0e0;
  margin-bottom: ${th('space.1')};
`

const StaffName = styled.div`
  font-weight: bold;
`
const StaffCard = ({ name, telephone, jobTitle, photoURL }) => (
  <React.Fragment>
    {photoURL && <StaffImg alt={`${name}'s profile image`} src={photoURL} />}
    <StaffName>{name}</StaffName>
    <div>{jobTitle}</div>
    <div>{telephone}</div>
  </React.Fragment>
)

StaffCard.propTypes = {
  name: PropType.string.isRequired,
  telephone: PropType.string.isRequired,
  jobTitle: PropType.string.isRequired,
  photoURL: PropType.string,
}

StaffCard.defaultProps = {
  photoURL: null,
}
export default StaffCard
