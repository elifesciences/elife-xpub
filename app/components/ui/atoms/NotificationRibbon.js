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
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('space.3')};
  text-align: center;
`
