import React from 'react'
import PropTypes from 'prop-types'

import { peoplePropType } from './types'
import TwoColumnLayout from '../../global/layout/TwoColumnLayout'
import PersonPod from './PersonPod'

import { FixedSizeGrid as Grid } from 'react-window'

const Cell = ({ columnIndex, rowIndex, style  }) => (
    <div style={style}>
      Item {rowIndex},{columnIndex}
    </div>
);

const PersonPodGrid = ({
  people,
  isSelected,
  toggleSelection,
  selection,
  maxSelection,
  ...props
}) => (
  <Grid
    columnCount={2}
    columnWidth={420}
    rowCount={people.length}
    rowHeight={120 + 24}
    height={350}
    width={840}
  >
    {Cell}
  </Grid>
)

PersonPodGrid.propTypes = {
  people: peoplePropType.isRequired,
  isSelected: PropTypes.func.isRequired,
  toggleSelection: PropTypes.func.isRequired,
  selection: peoplePropType.isRequired,
  maxSelection: PropTypes.number,
}

PersonPodGrid.defaultProps = {
  maxSelection: Infinity,
}

export default PersonPodGrid
