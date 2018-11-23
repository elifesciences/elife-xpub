import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from '@pubsweet/ui'
import SmallParagraph from './SmallParagraph'
import Paragraph from './Paragraph'

const PersonInfo = ({ person }) => {
  const { name, aff, focuses, expertises } = person
  return (
    <React.Fragment>
      <H2>{name}</H2>
      <Paragraph>{aff}</Paragraph>
      <SmallParagraph>Research focuses: {focuses.join(', ')}</SmallParagraph>
      <SmallParagraph secondary>
        Expertises: {expertises.join(', ')}
      </SmallParagraph>
    </React.Fragment>
  )
}

PersonInfo.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    aff: PropTypes.string.isRequired,
    focuses: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    expertises: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired,
}

export default PersonInfo
