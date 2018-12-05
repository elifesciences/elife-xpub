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

const PersonInfoModal = ({
  isSelected,
  onAccept,
  onCancel,
  open,
  name,
  institution,
  focuses,
  expertises,
}) => (
  <ModalDialog
    acceptText={isSelected ? 'Remove editor' : 'Add editor'}
    cancelText="Cancel"
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
  </ModalDialog>
)

PersonInfoModal.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  name: personNamePropType.isRequired,
  institution: affiliationPropType.isRequired,
  focuses: focusesPropType.isRequired,
  expertises: expertisesPropType.isRequired,
}

export default PersonInfoModal
