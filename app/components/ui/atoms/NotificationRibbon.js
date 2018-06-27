import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const backgroundColor = ({ type = 'primary', theme }) =>
  ({
    error: theme.colorError,
    success: theme.colorSuccess,
    primary: theme.colorPrimary,
  }[type])

export default styled.div`
  background: ${backgroundColor};
  color: ${th('colorTextReverse')};
  padding: ${th('space.2')};
  font-family: ${th('fontHeading')};
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  a {
    text-decoration: underline;
    color: inherit;
    cursor: pointer;
  }
`
