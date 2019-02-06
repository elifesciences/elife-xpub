import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'

import media from 'global/layout/media'
import NavigationDropdown from 'ui/atoms/NavigationDropdown'
import Tabs from 'ui/molecules/Tabs'
import EjpLink from './EjpLink'

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
        <EjpLink />
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
