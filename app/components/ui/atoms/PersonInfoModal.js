import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { H2 } from '@pubsweet/ui'
import SmallParagraph from './SmallParagraph'
import Paragraph from './Paragraph'
import ModalDialog from '../molecules/ModalDialog'

const StyledH2 = styled(H2)`
  margin-bottom: 0;
`

const StyledSmallParagraph = styled(SmallParagraph)`
  margin-bottom: ${th('space.4')};
`

const PersonInfoModal = ({
  isSelected,
  acceptText,
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
  acceptText: PropTypes.string.isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  institution: PropTypes.string.isRequired,
  focuses: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  expertises: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

export default PersonInfoModal
