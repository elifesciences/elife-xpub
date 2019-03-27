import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import media from '@elifesciences/component-elife-ui/client/global/layout/media'
import StickyFooter from '@elifesciences/component-elife-ui/client/ui/atoms/StickyFooter'
import DashboardContent from '../components/DashboardContent'
import Submissions from '../components/SubmissionsPanel'
import Archived from '../components/ArchivedPanel'
import NewSubmissionButton from '../components/NewSubmissionButton'

const DesktopSubmitContainer = styled(Box)`
  text-align: right;
  display: none;
  ${media.tabletPortraitUp`display: block;`};
`

const MobileOnlyContainer = styled(Box)`
  display: block;
  ${media.tabletPortraitUp`display: none;`};
`

const DashboardPage = ({ history }) => (
  <React.Fragment>
    <Box mx={[0, 0, 0, '16.666%']} pb={[6, 6, 0, 0]}>
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
      <StickyFooter pb={[18, 18, 5, 5]}>
        <NewSubmissionButton
          dataTestId="mobile-new-submission"
          history={history}
        />
      </StickyFooter>
    </MobileOnlyContainer>
  </React.Fragment>
)

export default DashboardPage
