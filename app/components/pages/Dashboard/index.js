import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'

import media from '../../global/layout/media'
import SmallParagraph from '../../ui/atoms/SmallParagraph'
import NativeLink from '../../ui/atoms/NativeLink'
import StickyFooter from '../../ui/atoms/StickyFooter'
import Tabs from '../../ui/molecules/Tabs'
import Submissions from './panels/Submissions'
import Archived from './panels/Archived'
import NewSubmissionButton from './NewSubmissionButton'

const BoxHiddenFromMobile = styled(Box)`
  text-align: right;
  display: none;
  ${media.mobileUp`display: block`};
`

const TabbedSubmissions = styled(Tabs)`
  min-height: 300px;
  margin-bottom: ${th('space.3')};
`

const MobileOnlyStickyFooter = styled(StickyFooter)`
  display: block;
  ${media.mobileUp`display: none;`};
`

const CenterdSmallParagraph = styled(SmallParagraph)`
  color: ${th('colorTextSecondary')};
  text-align: center;
`
const DashboardPage = ({ history }) => (
  <Flex>
    <Box flex="1 1 auto" mx={[0, 0, 0, '16.666%']}>
      <BoxHiddenFromMobile mb={1} mt={3}>
        <NewSubmissionButton history={history} />
      </BoxHiddenFromMobile>

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

      <CenterdSmallParagraph>
        Can&#39;t find a submission? You might find it in our full{' '}
        <NativeLink href="https://submit.elifesciences.org">
          peer review and submissions
        </NativeLink>{' '}
        system
      </CenterdSmallParagraph>
    </Box>

    <MobileOnlyStickyFooter>
      <NewSubmissionButton history={history} />
    </MobileOnlyStickyFooter>
  </Flex>
)

export default DashboardPage
