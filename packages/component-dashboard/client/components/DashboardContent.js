import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'
import { Link } from 'react-router-dom'

import media from '@elifesciences/component-elife-ui/client/global/layout/media'
import NavigationDropdown from '@elifesciences/component-elife-ui/client/atoms/NavigationDropdown'
import Tabs from '@elifesciences/component-elife-ui/client/molecules/Tabs'
import NativeLink from '@elifesciences/component-elife-ui/client/atoms/NativeLink'
import FooterText from '@elifesciences/component-elife-ui/client/atoms/FooterText'

const MobileOnlySubmissionsContainer = styled(Box).attrs({ mx: -3 })`
  border-bottom: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  ${media.mobileUp`display: none;`};
`

const TabbedSubmissions = styled(Tabs)`
  min-height: 475px;
  margin-bottom: ${th('space.3')};
`

const TabsHiddenFromMobile = styled(Tabs.List)`
  display: none;
  ${media.mobileUp`display: flex;`};
`

class DashboardContent extends React.Component {
  state = {
    selectedIndex: 0,
  }

  onTabSelect = selectedIndex => {
    this.setState({ selectedIndex })
  }

  render() {
    const { submissionViewStates } = this.props
    return (
      <React.Fragment>
        <MobileOnlySubmissionsContainer>
          <NavigationDropdown
            onSelection={option => this.onTabSelect(option.value)}
            options={submissionViewStates.map((view, viewIndex) => ({
              label: view.label,
              value: viewIndex,
            }))}
            value={this.state.selectedIndex}
          />
        </MobileOnlySubmissionsContainer>
        <TabbedSubmissions
          onSelect={this.onTabSelect}
          selectedIndex={this.state.selectedIndex}
        >
          <TabsHiddenFromMobile>
            {submissionViewStates.map(view => (
              <Tabs.Tab key={view.label}>{view.label}</Tabs.Tab>
            ))}
          </TabsHiddenFromMobile>
          {submissionViewStates.map(view => (
            <Tabs.Panel
              data-test-id={view.label.toLowerCase()}
              key={view.label}
            >
              {view.component}
            </Tabs.Panel>
          ))}
        </TabbedSubmissions>
        <FooterText>
          To find existing submissions or to submit a{' '}
          <Link to="/author-guide/types">Research Advance</Link> please visit
          our{' '}
          <NativeLink href="https://submit.elifesciences.org">
            full peer review and submissions system
          </NativeLink>{' '}
        </FooterText>
      </React.Fragment>
    )
  }
}

DashboardContent.propTypes = {
  submissionViewStates: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      component: PropTypes.element.isRequired,
    }),
  ).isRequired,
}

export default DashboardContent
