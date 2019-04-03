import React from 'react'
import styled from 'styled-components'
import { compose, branch, renderComponent, withHandlers } from 'recompose'
import { Box } from '@rebass/grid'
import { Button } from '@pubsweet/ui'
import media from '@elifesciences/component-elife-ui/client/global/layout/media'
import {
  Loading,
  StickyFooter,
} from '@elifesciences/component-elife-ui/client/atoms'

import DashboardContent from '../components/DashboardContent'
import DashboardList from '../components/DashboardList'
import Archived from '../components/ArchivedPanel'
import withGQL from '../graphql/withGQL'

const DesktopSubmitContainer = styled(Box)`
  text-align: right;
  display: none;
  ${media.tabletPortraitUp`display: block;`};
`

const MobileOnlyContainer = styled(Box)`
  display: block;
  ${media.tabletPortraitUp`display: none;`};
`

const DashboardPage = ({ createNewSubmission, deleteSubmission, data }) => (
  <React.Fragment>
    <Box mx={[0, 0, 0, '16.666%']} pb={[6, 6, 0, 0]}>
      <DesktopSubmitContainer mb={1} mt={3}>
        <Button
          dataTestId="desktop-new-submission"
          onClick={createNewSubmission}
          primary
        >
          New Submission
        </Button>
      </DesktopSubmitContainer>
      <DashboardContent
        submissionViewStates={[
          {
            label: 'Submissions',
            component: (
              <DashboardList
                deleteSubmission={deleteSubmission}
                manuscripts={data.manuscripts}
              />
            ),
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
        <Button
          dataTestId="mobile-new-submission"
          onClick={createNewSubmission}
          primary
        >
          New Submission
        </Button>
      </StickyFooter>
    </MobileOnlyContainer>
  </React.Fragment>
)

export default compose(
  withGQL,
  branch(
    props => props.data && (props.data.loading && !props.data.manuscripts),
    renderComponent(Loading),
  ),
  branch(
    props => !props.data || props.data.error,
    props => <div>{props.error}</div>,
  ),
  withHandlers({
    createNewSubmission: props => () =>
      props
        .createManuscript()
        .then(result =>
          props.history.push(
            `/submit/${result.data.createManuscript.id}/author`,
          ),
        ),
    deleteSubmission: props => manuscriptId =>
      props.deleteManuscript({ variables: { id: manuscriptId } }),
  }),
)(DashboardPage)
