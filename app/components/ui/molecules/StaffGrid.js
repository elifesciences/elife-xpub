import React from 'react'
import styled from 'styled-components'
import StaffCard from './StaffCard'

const { Flex, Box } = require('grid-styled')

const Grid = styled(Flex)`
  flex-flow: row wrap;
  justify-content: space-between;
`
const Card = styled(Box)`
  padding-top: 20px;
`

const StaffGrid = ({ staff }) => (
  <Grid>
    {staff.map(person => (
      <Card px={2} width={[1 / 2, 1 / 2, 1 / 3]}>
        <StaffCard
          jobTitle={person.jobTitle}
          name={person.name}
          photoURL={person.photoURL}
          telephone={person.telephone}
        />
      </Card>
    ))}
  </Grid>
)

export default StaffGrid
