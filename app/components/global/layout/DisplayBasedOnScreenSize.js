import styled from 'styled-components'

export const HideOnMobile = styled.div`
  @media (max-width: 480px) {
    display: none;
  }
`

export const ShowOnMobile = styled.div`
  @media (min-width: 480px) {
    display: none;
  }
`
