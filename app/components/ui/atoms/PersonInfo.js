import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from '@pubsweet/ui'
import SmallParagraph from './SmallParagraph'
import Paragraph from './Paragraph'

const PersonInfo = ({ name, institution, focuses, expertises }) => (
  <React.Fragment>
    <H2>{name}</H2>
    <Paragraph>{institution}</Paragraph>
    <SmallParagraph>Research focuses: {focuses.join(', ')}</SmallParagraph>
    <SmallParagraph secondary>
      Expertises: {expertises.join(', ')}
    </SmallParagraph>
  </React.Fragment>
)

PersonInfo.propTypes = {
  name: PropTypes.string.isRequired,
  institution: PropTypes.string.isRequired,
  focuses: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  expertises: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
}

export default PersonInfo
