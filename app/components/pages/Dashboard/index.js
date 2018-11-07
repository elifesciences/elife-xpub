import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'
import media from '../../global/layout/media'
import StickyFooter from '../../ui/atoms/StickyFooter'
import NavigationDropdown from '../../ui/atoms/NavigationDropdown'
import Tabs from '../../ui/molecules/Tabs'
import Submissions from './panels/Submissions'
import Archived from './panels/Archived'
import NewSubmissionButton from './NewSubmissionButton'
import EjpLink from './EjpLink'

const DesktopSubmitContainer = styled(Box)`
  text-align: right;
  display: none;
  ${media.mobileUp`display: block;`};
`

const MobileOnlyContainer = styled(Box)`
  display: block;
  ${media.mobileUp`display: none;`};
`

const TabbedSubmissions = styled(Tabs)`
  min-height: 300px;
  margin-bottom: ${th('space.3')};
`

const TabsHiddenFromMobile = styled(Tabs.List)`
  display: none;
  ${media.mobileUp`display: flex;`};
`
const MobileOnlySubmissionsContainer = styled(Box).attrs({ mx: -3 })`
  border-bottom: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  ${media.mobileUp`display: none;`};
`

class DashboardPage extends React.Component {
  state = {
    selectedIndex: 0,
  }

  onTabSelect = selectedIndex => {
    this.setState({ selectedIndex })
  }

  render() {
    const { history } = this.props
    return (
      <React.Fragment>
        <Box mx={[0, 0, '16.666%', '16.666%']}>
          <DesktopSubmitContainer mb={1} mt={3}>
            <NewSubmissionButton
              dataTestId="desktop-new-submission"
              history={history}
            />
          </DesktopSubmitContainer>
          <MobileOnlySubmissionsContainer>
            <NavigationDropdown
              onSelection={option => this.onTabSelect(option.value)}
              options={[
                {
                  label: 'Submissions',
                  value: 0,
                },
                { label: 'Archive', value: 1 },
              ]}
              value={this.state.selectedIndex}
            />
          </MobileOnlySubmissionsContainer>
          <TabbedSubmissions
            onSelect={this.onTabSelect}
            selectedIndex={this.state.selectedIndex}
          >
            <TabsHiddenFromMobile>
              <Tabs.Tab>Submissions</Tabs.Tab>
              <Tabs.Tab>Archive</Tabs.Tab>
            </TabsHiddenFromMobile>
            <Tabs.Panel data-test-id="manuscripts">
              <Submissions />
            </Tabs.Panel>
            <Tabs.Panel>
              <Archived />
            </Tabs.Panel>
          </TabbedSubmissions>
          <EjpLink />
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
  }
}

export default DashboardPage
