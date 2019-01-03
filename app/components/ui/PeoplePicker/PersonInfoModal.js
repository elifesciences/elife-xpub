import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { H2 } from '@pubsweet/ui'

import {
  personNamePropType,
  affiliationPropType,
  focusesPropType,
  expertisesPropType,
} from './types'
import SmallParagraph from '../atoms/SmallParagraph'
import Paragraph from '../atoms/Paragraph'
import ModalDialog from '../molecules/ModalDialog'

const StyledH2 = styled(H2)`
  margin-bottom: 0;
`

const StyledSmallParagraph = styled(SmallParagraph)`
  margin-bottom: ${th('space.4')};
`
const ErrorParagraph = styled(SmallParagraph)`
  margin-bottom: ${th('space.4')};
  color: ${th('colorError')};
`

const PersonInfoModal = ({
  isSelected,
  onAccept,
  onCancel,
  open,
  maxSelection,
  name,
  institution,
  focuses,
  expertises,
  isSelectButtonClickable,
}) => (
  <ModalDialog
    acceptText={isSelected ? 'Remove editor' : 'Add editor'}
    cancelText="Cancel"
    isSelectButtonClickable={isSelectButtonClickable}
    onAccept={onAccept}
    onCancel={onCancel}
    open={open}
  >
    <StyledH2>{name}</StyledH2>
    <Paragraph>{institution}</Paragraph>
    <SmallParagraph>Expertise: {expertises.join(', ')}</SmallParagraph>
    <StyledSmallParagraph secondary>
      Research focuses: {focuses.join(', ')}
    </StyledSmallParagraph>
    {!isSelectButtonClickable && (
      <ErrorParagraph data-test-id="maximum-people-selected-error">
        Maximum {maxSelection} already selected
      </ErrorParagraph>
    )}
  </ModalDialog>
)

PersonInfoModal.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  maxSelection: PropTypes.number,
  name: personNamePropType.isRequired,
  institution: affiliationPropType.isRequired,
  focuses: focusesPropType.isRequired,
  expertises: expertisesPropType.isRequired,
}

PersonInfoModal.defaultProps = {
  maxSelection: Infinity,
}

export default PersonInfoModal
