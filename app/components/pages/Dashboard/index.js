import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'

import media from '../../global/layout/media'
import StickyFooter from '../../ui/atoms/StickyFooter'
import Tabs from '../../ui/molecules/Tabs'
import Submissions from './panels/Submissions'
import Archived from './panels/Archived'
import NewSubmissionButton from './NewSubmissionButton'
import SubmissionsDropdown from './SubmissionsDropdown'
import EjpLink from './EjpLink'

const ContainerHiddenFromMobile = styled(Flex)`
  text-align: right;
  display: none;
  ${media.mobileUp`display: block`};
`

const MobileOnlyContainer = styled(Box)`
  display: block;
  ${media.mobileUp`display: none;`};
`

const TabbedSubmissions = styled(Tabs)`
  min-height: 300px;
  margin-bottom: ${th('space.3')};
`

const DashboardPage = ({ history }) => (
  <React.Fragment>
    <ContainerHiddenFromMobile flex="1 1 auto" mx={[0, 0, 0, '16.666%']}>
      <Box mb={1} mt={3}>
        <NewSubmissionButton history={history} />
      </Box>
      <TabbedSubmissions>
        <Tabs.List>
          <Tabs.Tab>Submissions</Tabs.Tab>
          <Tabs.Tab>Archive</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel data-test-id="manuscripts">
          <Submissions />
        </Tabs.Panel>
        <Tabs.Panel>
          <Archived />
        </Tabs.Panel>
      </TabbedSubmissions>
      <EjpLink />
    </ContainerHiddenFromMobile>

    <MobileOnlyContainer>
      <SubmissionsDropdown />
      <StickyFooter>
        <NewSubmissionButton history={history} />
      </StickyFooter>
    </MobileOnlyContainer>
  </React.Fragment>
)

export default DashboardPage
