import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { H2 } from '@pubsweet/ui'
import SmallParagraph from './SmallParagraph'
import Paragraph from './Paragraph'

const StyledH2 = styled(H2)`
  margin-bottom: 0;
`

const StyledSmallParagraph = styled(SmallParagraph)`
  margin-bottom: ${th('space.4')};
`

const PersonInfo = ({ name, institution, focuses, expertises }) => (
  <React.Fragment>
    <StyledH2>{name}</StyledH2>
    <Paragraph>{institution}</Paragraph>
    <SmallParagraph>Expertise: {expertises.join(', ')}</SmallParagraph>
    <StyledSmallParagraph secondary>
      Research focuses: {focuses.join(', ')}
    </StyledSmallParagraph>
  </React.Fragment>
)

PersonInfo.propTypes = {
  name: PropTypes.string.isRequired,
  institution: PropTypes.string.isRequired,
  focuses: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  expertises: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

export default PersonInfo
