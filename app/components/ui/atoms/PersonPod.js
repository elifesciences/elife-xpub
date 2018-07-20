import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Action, Button } from '@pubsweet/ui'
import { Flex, Box } from 'grid-styled'

import Icon from './Icon'

const RegularP = styled.p`
  font-size: ${th('fontSizeBase')};
  line-height: ${th('fontLineHeightBase')};
  margin: 0;
`

const SmallP = styled.p`
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('fontLineHeightBaseSmall')};
  // vertical spacing of 6px comes from: 24px grid - fontLineHeightBaseSmall
  margin: 3px 0;
`

const SmallAction = styled(Action)`
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('fontLineHeightBaseSmall')};
  margin: 3px 0;
`

const StyledButton = styled(Button)`
  height: 100%;
  border: none;
`

const StyledPod = styled(Flex)`
  background: ${th('colorSecondary')};
  border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
  border-radius: ${th('borderRadius')};
  color: ${th('colorText')};
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  min-width: 312px;
  height: 120px;
`

const PersonPod = ({
  isIconClickable,
  onIconClick,
  textContainer,
  icon,
  ...props
}) => (
  <StyledPod justifyContent="space-between">
    {textContainer}
    <Flex flexDirection="column" justifyContent="center">
      <StyledButton
        data-test-id="person-pod-toggle"
        disabled={!isIconClickable}
        onClick={onIconClick}
      >
        {icon}
      </StyledButton>
    </Flex>
  </StyledPod>
)

const PlusIcon = <Icon size={3}>Plus</Icon>
const RubbishBinIcon = <Icon size={3}>RubbishBin</Icon>
const SelectedTickIcon = <Icon size={4}>SelectedTick</Icon>

const switchIcon = iconState => {
  switch (iconState) {
    case 'add':
      return PlusIcon
    case 'remove':
      return RubbishBinIcon
    case 'selected':
      return SelectedTickIcon
    default:
      return PlusIcon
  }
}

const buildPersonText = ({
  name,
  institution,
  keywords,
  isKeywordClickable,
  onKeywordClick = null,
  isStatusShown,
  status = '',
  ...props
}) => (
  <Box {...props} m={2}>
    <RegularP>{name}</RegularP>
    <RegularP>{institution}</RegularP>
    {isKeywordClickable && (
      <SmallAction onClick={onKeywordClick}>{keywords}</SmallAction>
    )}
    {!isKeywordClickable && <SmallP>{keywords}</SmallP>}
    {isStatusShown && <SmallP>{status}</SmallP>}
  </Box>
)

const PersonPod = ({
  isIconClickable = true,
  onIconClick,
  iconState,
  ...props
}) => {
  const IconByState = switchIcon(iconState)
  const ChosenPerson = buildPersonText(props)
  return (
    <PersonPodContainer
      icon={IconByState}
      isIconClickable={isIconClickable}
      onIconClick={onIconClick}
      textContainer={ChosenPerson}
    />
  )
}

const buildChooserText = ({ role, isRequired, ...props }) => (
  <Flex flexDirection="column" justifyContent="center">
    <Box ml={2}>
      <RegularP>
        Choose {role} ({isRequired ? 'required' : 'optional'})
      </RegularP>
    </Box>
  </Flex>
)

const SelectButton = ({ onIconClick, ...props }) => {
  const ChooserText = buildChooserText(props)
  return (
    <PersonPodContainer
      icon={PlusIcon}
      onIconClick={onIconClick}
      textContainer={ChooserText}
    />
  )
}

PersonPodContainer.propTypes = {
  onIconClick: PropTypes.func.isRequired,
  textContainer: PropTypes.element.isRequired,
  icon: PropTypes.element.isRequired,
}

switchIcon.PropTypes = {
  iconState: PropTypes.oneOf[('add', 'remove', 'selected')],
}

buildPersonText.propTypes = {
  name: PropTypes.string.isRequired,
  institution: PropTypes.string.isRequired,
  keywords: PropTypes.string.isRequired,
  isKeywordClickable: PropTypes.bool.isRequired,
  onKeywordClick: PropTypes.func,
  isStatusShown: PropTypes.bool.isRequired,
  status: PropTypes.string,
}

buildPersonText.defaultProps = {
  onKeywordClick: null,
  status: '',
}

PersonPod.propTypes = {
  iconState: PropTypes.string.isRequired,
  onIconClick: PropTypes.func.isRequired,
}

buildChooserText.propTypes = {
  role: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
}

SelectButton.propTypes = {
  onIconClick: PropTypes.func.isRequired,
}

PersonPod.SelectButton = SelectButton

export default PersonPod
