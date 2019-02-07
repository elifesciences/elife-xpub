import React from 'react'
import { H1 } from '@pubsweet/ui'

import StaffGrid from 'ui/molecules/StaffGrid'
import StaffCard from 'ui/molecules/StaffCard'

const EditorialStaff = () => (
  <React.Fragment>
    <H1>Editorial Staff</H1>
    <p>
      Our Editorial Staff are happy to help with any enquiries arising before
      acceptance.
    </p>
    <StaffGrid>
      <StaffCard
        jobTitle="Editorial Manager"
        name="Wei Mun Chan"
        photoURL="https://iiif.elifesciences.org/journal-cms/person%2F2017-07%2Fweimun.jpg/0,214,2830,1602/502,284/0/default.jpg"
        telephone="+44 [0]1223 855379"
      />
      <StaffCard
        jobTitle="Journal Development Editor"
        name="Maria Guerreiro"
        photoURL="https://iiif.elifesciences.org/journal-cms/person%2F2017-07%2Fmaria.jpg/0,17,1000,566/502,284/0/default.jpg"
        telephone="+44 [0]1223 855376"
      />
      <StaffCard
        jobTitle="Senior Editorial Assistant"
        name="Susanna Richmond"
        photoURL="https://iiif.elifesciences.org/journal-cms/person%2F2017-07%2Fsusanna.jpg/0,53,1000,566/502,284/0/default.jpg"
        telephone="+44 [0]1223 855377"
      />
      <StaffCard
        jobTitle="Editorial Assistant"
        name="Emma Smith"
        photoURL="https://iiif.elifesciences.org/journal-cms/person%2F2018-07%2Femmasmith.jpg/0,0,2124,1202/502,284/0/default.jpg"
        telephone="+44 [0]1223 750665"
      />
      <StaffCard
        jobTitle="Editorial Assistant"
        name="Milly McConnell"
        photoURL="https://iiif.elifesciences.org/journal-cms/person%2F2018-07%2Fmillie.jpg/0,0,2136,1209/502,284/0/default.jpg"
        telephone="+44 [0]1223 855348"
      />
    </StaffGrid>
  </React.Fragment>
)

export default EditorialStaff
