import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import media from '../../global/layout/media'
import StickyFooter from '../../ui/atoms/StickyFooter'
import DashboardContent from './DashboardContent'
import Submissions from './panels/Submissions'
import Archived from './panels/Archived'
import NewSubmissionButton from './NewSubmissionButton'

const DesktopSubmitContainer = styled(Box)`
  text-align: right;
  display: none;
  ${media.mobileUp`display: block;`};
`

const MobileOnlyContainer = styled(Box)`
  display: block;
  ${media.mobileUp`display: none;`};
`

const DashboardPage = ({ history }) => (
  <React.Fragment>
    <Box mx={[0, 0, '16.666%', '16.666%']}>
      <DesktopSubmitContainer mb={1} mt={3}>
        <NewSubmissionButton
          dataTestId="desktop-new-submission"
          history={history}
        />
      </DesktopSubmitContainer>
      <DashboardContent
        submissionViewStates={[
          {
            label: 'Submissions',
            component: <Submissions />,
          },
          {
            label: 'Archive',
            component: <Archived />,
          },
        ]}
      />
    </Box>
    <MobileOnlyContainer>
      <StickyFooter>
        <NewSubmissionButton
          dataTestId="mobile-new-submission"
          history={history}
        />
      </StickyFooter>
    </MobileOnlyContainer>
  </React.Fragment>
)

export default DashboardPage
