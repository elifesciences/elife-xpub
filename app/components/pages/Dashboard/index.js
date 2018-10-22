import React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'styled-components'
import { Box, Flex } from 'grid-styled'
import { Button } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import { CREATE_MANUSCRIPT } from '../SubmissionWizard/operations'
import media from '../../global/layout/media'
import SmallParagraph from '../../ui/atoms/SmallParagraph'
import ExternalLink from '../../ui/atoms/ExternalLink'
import StickyFooter from '../../ui/atoms/StickyFooter'
import Tabs from '../../ui/molecules/Tabs'
import Submissions from './panels/Submissions'
import Archived from './panels/Archived'

const BoxHiddenFromMobile = styled(Box)`
  text-align: right;
  display: none;
  ${media.mobileUp`display: block`};
`

const DashboardPanel = styled(Tabs.Panel)`
  min-height: 300px;
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
  <Mutation mutation={CREATE_MANUSCRIPT}>
    {createManuscript => (
      <Flex>
        <Box flex="1 1 auto" mx={[0, 0, 0, '16.666%']}>
          <BoxHiddenFromMobile mb={1} mt={3}>
            <Button
              data-test-id="desktop-new-submission"
              onClick={() =>
                createManuscript().then(result =>
                  history.push(
                    `/submit/${result.data.createManuscript.id}/author`,
                  ),
                )
              }
              primary
            >
              New Submission
            </Button>
          </BoxHiddenFromMobile>
          <Tabs>
            <Tabs.List>
              <Tabs.Tab>Submissions</Tabs.Tab>
              <Tabs.Tab>Archive</Tabs.Tab>
            </Tabs.List>
            <DashboardPanel data-test-id="manuscripts">
              <Submissions />
            </DashboardPanel>
            <DashboardPanel>
              <Archived />
            </DashboardPanel>
          </Tabs>
          <CenterdSmallParagraph>
            Can&#39;t find a submission? You might find it in our full{' '}
            <ExternalLink href="https://submit.elifesciences.org">
              peer review and submissions
            </ExternalLink>{' '}
            system
          </CenterdSmallParagraph>
        </Box>
        <MobileOnlyStickyFooter>
          <Button
            data-test-id="mobile-new-submission"
            onClick={createManuscript}
            primary
          >
            New Submission
          </Button>
        </MobileOnlyStickyFooter>
      </Flex>
    )}
  </Mutation>
)

export default DashboardPage
