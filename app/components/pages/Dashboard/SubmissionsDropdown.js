import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { th } from '@pubsweet/ui-toolkit'

import media from '../../global/layout/media'
import Submissions from './panels/Submissions'
import Archived from './panels/Archived'
import NavigationDropdown from '../../ui/atoms/NavigationDropdown'
import EjpLink from './EjpLink'

const MobileOnlySubmissionsContainer = styled(Box).attrs({ mx: -3 })`
  border-bottom: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  margin-bottom: ${th('space.3')};
  ${media.mobileUp`display: none;`};
`

class SubmissionsDropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      submissionState: 'submissions',
    }
  }

  handleSelection = selectedItem => {
    this.setState({ submissionState: selectedItem.value })
  }

  render() {
    return (
      <React.Fragment>
        <MobileOnlySubmissionsContainer>
          <NavigationDropdown
            onSelection={this.handleSelection}
            options={[
              {
                label: 'Submissions',
                value: 'submissions',
              },
              { label: 'Archive', value: 'archive' },
            ]}
            value={this.state.submissionState}
          />
        </MobileOnlySubmissionsContainer>
        <Box mb={3}>
          {this.state.submissionState === 'submissions' && <Submissions />}
          {this.state.submissionState === 'archive' && <Archived />}
        </Box>
        <EjpLink />
      </React.Fragment>
    )
  }
}

export default SubmissionsDropdown
