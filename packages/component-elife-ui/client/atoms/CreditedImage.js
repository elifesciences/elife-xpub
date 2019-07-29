import React from 'react'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import { th } from '@pubsweet/ui-toolkit'
import media from '@elifesciences/component-elife-ui/client/global/layout/media'

const ImageBlock = styled(Box)`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`

const ImageContainer = styled(Box)`
  width: 75%;
  height: 100%;
  display: none;
  ${media.tabletPortraitUp`
  display: block`};
`

const ImageCredit = styled(Box)`
  color: ${th('colorTextSecondary')};
  font-size: 12px;
  text-align: right;
  a {
    color: inherit;
    text-decoration: underline;
  }
`

const CreditedImage = ({ image }) => (
  <ImageContainer>
    <ImageBlock image={image} />
    <ImageCredit py={2}>
      Illustration by <a href="http://www.davidebonazzi.com/">Davide Bonazzi</a>
    </ImageCredit>
  </ImageContainer>
)
export default CreditedImage
