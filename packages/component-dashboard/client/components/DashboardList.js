import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'
import { Paragraph } from '@elifesciences/component-elife-ui/client/atoms'

import DashboardListItem from './DashboardListItem'

const EmptyListMessage = styled(Box)`
  text-align: center;
  color: ${th('colorTextSecondary')};
`
const EmptyListSmallParagraph = styled(Paragraph.Small)`
  font-family: ${th('fontInterface')};
  font-size: 12px;
  font-weight: 400;
  font-family: 'Noto Sans';
`
const EmptyListParagraph = styled(Box)`
  margin-bottom: 24px;
`

const DashboardList = ({ manuscripts, deleteSubmission }) =>
  manuscripts.length > 0 ? (
    manuscripts.map((manuscript, index) => (
      <DashboardListItem
        index={index}
        key={manuscript.id}
        manuscript={manuscript}
        onDelete={() => deleteSubmission(manuscript.id)}
      />
    ))
  ) : (
    <EmptyListMessage mt={7}>
      <EmptyListParagraph>
        You currently have no active submissions
      </EmptyListParagraph>
      <EmptyListSmallParagraph>
        You may want to bookmark this page to easily retrieve your in progress
        submissions.
      </EmptyListSmallParagraph>
    </EmptyListMessage>
  )

DashboardList.propTypes = {
  manuscripts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      meta: PropTypes.shape({
        title: PropTypes.string,
      }).isRequired,
    }),
  ),
  deleteSubmission: PropTypes.func.isRequired,
}

DashboardList.defaultProps = {
  manuscripts: [],
}

export default DashboardList
