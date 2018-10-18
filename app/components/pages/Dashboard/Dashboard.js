import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from 'grid-styled'
import { Mutation } from 'react-apollo'
import { Button } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import SmallParagraph from '../../ui/atoms/SmallParagraph'
import ExternalLink from '../../ui/atoms/ExternalLink'
import Tabs from '../../ui/molecules/Tabs'
import DashboardList from '../../ui/molecules/DashboardList'
import { MANUSCRIPTS, DELETE_MANUSCRIPT } from './oporations'
import ManuscriptsQuery from './ManuscriptsQuery'

const RightAlignedButton = styled(Box)`
  margin: ${th('space.3')} 0 ${th('space.1')};
  text-align: right;
`

const DashboardPanel = styled(Tabs.Panel)`
  min-height: 300px;
`

const EmptyListMessage = styled.div`
  margin-top: ${th('space.7')};
  text-align: center;
  color: ${th('colorTextSecondary')};
`

const CenterdSmallParagraph = styled(SmallParagraph)`
  color: ${th('colorTextSecondary')};
  text-align: center;
`

const Dashboard = ({ createManuscript }) => (
  <Flex>
    <Box flex="1 1 auto" mx={[0, 0, 0, '16.666%']}>
      <RightAlignedButton>
        <Button data-test-id="submit" onClick={createManuscript} primary>
          Submit a manuscript
        </Button>
      </RightAlignedButton>
      <Tabs>
        <Tabs.List>
          <Tabs.Tab>Submissions</Tabs.Tab>
          <Tabs.Tab>Archive</Tabs.Tab>
        </Tabs.List>
        <DashboardPanel>
          <Mutation
            mutation={DELETE_MANUSCRIPT}
            refetchQueries={[{ query: MANUSCRIPTS }]}
          >
            {deleteManuscript => (
              <ManuscriptsQuery query={MANUSCRIPTS}>
                <DashboardList
                  deleteManuscript={id =>
                    deleteManuscript({ variables: { id } })
                  }
                />
              </ManuscriptsQuery>
            )}
          </Mutation>
        </DashboardPanel>
        <DashboardPanel>
          <EmptyListMessage>Archived placeholder view.</EmptyListMessage>
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
  </Flex>
)

export default Dashboard
