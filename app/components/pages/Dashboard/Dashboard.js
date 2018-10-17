import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Box, Flex } from 'grid-styled'
import { Button } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'
import SmallParagraph from '../../ui/atoms/SmallParagraph'
import ExternalLink from '../../ui/atoms/ExternalLink'
import Tabs from '../../ui/molecules/Tabs'
import DashboardListItem from '../../ui/molecules/DashboardListItem'

const RightAlignedButton = styled(Box)`
  margin: ${th('space.3')} 0;
  text-align: right;
`
const BoxNoMinWidth = styled(Box)`
  min-width: 0;
`

const DashboardList = styled.div`
  min-height: 300px;
`

const DashboardLink = styled(Link)`
  text-decoration: none;
  color: ${th('colorText')};
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

const Dashboard = ({ manuscripts, deleteManuscript, createManuscript }) => (
  <Flex>
    <BoxNoMinWidth flex="1 1 auto" mx={[0, 0, 0, '16.666%']}>
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
        <Tabs.Panel>
          <DashboardList data-test-id="manuscripts">
            {!manuscripts.length && (
              <EmptyListMessage>
                You currently have no active submissions
                <SmallParagraph>
                  You may want to bookmark this page to easily retrieve your in
                  progress submissions.
                </SmallParagraph>
              </EmptyListMessage>
            )}
            {!!manuscripts.length && (
              <React.Fragment>
                {manuscripts.map(manuscript => (
                  <DashboardLink
                    key={manuscript.id}
                    to={`/submit/${manuscript.id}`}
                  >
                    <DashboardListItem
                      date={new Date(manuscript.created)}
                      statusCode={manuscript.clientStatus}
                      title={manuscript.meta.title || '(Untitled)'}
                    />
                  </DashboardLink>
                ))}
                <Button
                  onClick={() =>
                    manuscripts.forEach(manuscript =>
                      deleteManuscript(manuscript.id),
                    )
                  }
                  small
                >
                  Delete All
                </Button>
              </React.Fragment>
            )}
          </DashboardList>
        </Tabs.Panel>
        <Tabs.Panel>
          <DashboardList>
            <EmptyListMessage>Archived placeholder view.</EmptyListMessage>
          </DashboardList>
        </Tabs.Panel>
      </Tabs>
      <CenterdSmallParagraph>
        Can&#39;t find a submission? You might find it in our full{' '}
        <ExternalLink href="https://submit.elifesciences.org">
          peer review and submissions
        </ExternalLink>{' '}
        system
      </CenterdSmallParagraph>
    </BoxNoMinWidth>
  </Flex>
)

export default Dashboard
