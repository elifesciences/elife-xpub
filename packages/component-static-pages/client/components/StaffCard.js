import React from 'react'
import PropType from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const StaffImg = styled.img`
  
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorFurniture')}
  margin-bottom: ${th('space.1')};
  max-width: 100%;
`

const StaffName = styled.div`
  font-family: ${th('fontHeading')};
  font-weight: 400;
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
