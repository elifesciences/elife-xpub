import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Action } from '@pubsweet/ui'
import { Flex, Box } from 'grid-styled'

import Icon from './Icon'
import ButtonAsIconWrapper from './ButtonAsIconWrapper'

const AddIcon = props => (
  <Icon
    iconName="Plus"
    overrideName="@pubsweet-pending.PeoplePicker.PersonPod.Add"
    {...props}
  />
)

const StyledAddIcon = styled(AddIcon)`
  fill: ${th('colorTextSecondary')};
`

const TrashIcon = props => (
  <Icon
    iconName="Trash"
    overrideName="@pubsweet-pending.PeoplePicker.PersonPod.Remove"
    {...props}
  />
)

const StyledRemoveIcon = styled(TrashIcon)`
  fill: ${th('colorTextSecondary')};
`

const CheckCircleIcon = props => (
  <Icon
    iconName="CheckCircle"
    overrideName="@pubsweet-pending.PeoplePicker.PersonPod.Selected"
    {...props}
  />
)

const StyledSelectedIcon = styled(CheckCircleIcon)`
  circle {
    fill: ${th('colorPrimary')};
  }
  height: ${th('space.4')}
  width: ${th('space.4')}
`

const InfoIcon = props => (
  <Icon iconName="Info" overrideName="info" {...props} />
)

const StyledInfoIcon = styled(InfoIcon)`
  margin-right: 6px;
  height: 18px;
  width: 18px;
  fill: ${th('colorPrimary')};
`

const StyledButton = styled.button`
  background-color: inherit;
  height: 100%;
  width: ${th('space.5')};
  border: none;

  &:hover ${StyledAddIcon}, &:hover ${StyledRemoveIcon} {
      fill: #666666;
    }

  &:hover ${StyledSelectedIcon} > circle {
      fill: #1378bb;
    }
  }
`

const RegularP = styled.p`
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`

const SmallP = styled.p`
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
  color: ${th('colorTextSecondary')}
  // vertical spacing of 6px comes from: 24px grid - lineHeightBaseSmall
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 3px 0;
`

const SmallAction = styled(Action)`
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
  margin: 3px 0;
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

const CollapsibleBox = styled(Box)`
  min-width: 0;
`

const PersonPodContainer = ({
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
        data-test-id="person-pod-button"
        disabled={!isIconClickable}
        onClick={onIconClick}
        type="button"
      >
        {icon}
      </StyledButton>
    </Flex>
  </StyledPod>
)

const PodIcon = ({ iconType }) => {
  switch (iconType) {
    case 'remove':
      return <StyledRemoveIcon />
    case 'selected':
      return <StyledSelectedIcon />
    case 'add':
    default:
      return <StyledAddIcon />
  }
}

const PersonText = ({
  name,
  institution = '',
  keywords,
  isKeywordClickable,
  onKeywordClick = null,
  isStatusShown = false,
  status = '',
  ...props
}) => {
  let keywordList
  if (isKeywordClickable) {
    keywordList = keywords.map(keyword => (
      <SmallAction
        data-test-id="clickable-keyword"
        key={keyword}
        onClick={() => onKeywordClick(keyword)}
      >
        {keyword}
      </SmallAction>
    ))
  } else {
    keywordList = keywords.map(keyword => (
      <span data-test-id="non-clickable-keyword" key={keyword}>
        {keyword}
      </span>
    ))
  }

  const separatedKeywords = keywordList.reduce(
    (accu, elem) => (accu === null ? [elem] : [...accu, ', ', elem]),
    null,
  )

  return (
    <CollapsibleBox m={2} {...props}>
      <RegularP>{name}</RegularP>
      {institution && <RegularP>{institution}</RegularP>}
      {!institution && <Box mb={3} />}
      <Flex alignItems="center">
        <ButtonAsIconWrapper>
          <StyledInfoIcon />
        </ButtonAsIconWrapper>
        <SmallP>{separatedKeywords}</SmallP>
      </Flex>
      {isStatusShown && <SmallP>{status}</SmallP>}
    </CollapsibleBox>
  )
}

const PersonPod = ({
  isIconClickable = true,
  onIconClick,
  iconType,
  ...props
}) => (
  <PersonPodContainer
    icon={<PodIcon iconType={iconType} />}
    isIconClickable={isIconClickable}
    onIconClick={onIconClick}
    textContainer={<PersonText {...props} />}
  />
)

const ChooserText = ({ roleName, isRequired, ...props }) => (
  <Flex flexDirection="column" justifyContent="center">
    <Box ml={2}>
      <RegularP>
        Choose {roleName} ({isRequired ? 'required' : 'optional'})
      </RegularP>
    </Box>
  </Flex>
)

const SelectButton = ({ isIconClickable, onIconClick, ...props }) => (
  <PersonPodContainer
    icon={<PodIcon iconType="add" />}
    isIconClickable
    onIconClick={onIconClick}
    textContainer={<ChooserText {...props} />}
  />
)

PersonPodContainer.propTypes = {
  isIconClickable: PropTypes.bool.isRequired,
  onIconClick: PropTypes.func.isRequired,
  textContainer: PropTypes.element.isRequired,
  icon: PropTypes.element.isRequired,
}

PodIcon.propTypes = {
  iconType: PropTypes.oneOf(['add', 'remove', 'selected']).isRequired,
}

PersonText.propTypes = {
  name: PropTypes.string.isRequired,
  institution: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string.isRequired),
  isKeywordClickable: PropTypes.bool.isRequired,
  onKeywordClick: PropTypes.func,
  isStatusShown: PropTypes.bool,
  status: PropTypes.string,
}

PersonText.defaultProps = {
  institution: '',
  keywords: [],
  onKeywordClick: null,
  isStatusShown: false,
  status: '',
}

PersonPod.propTypes = {
  isIconClickable: PropTypes.bool,
  onIconClick: PropTypes.func.isRequired,
  iconType: PropTypes.oneOf(['add', 'remove', 'selected']).isRequired,
}

PersonPod.defaultProps = {
  isIconClickable: true,
}

ChooserText.propTypes = {
  roleName: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
}

SelectButton.propTypes = {
  onIconClick: PropTypes.func.isRequired,
}

PersonPod.SelectButton = SelectButton

export default PersonPod
