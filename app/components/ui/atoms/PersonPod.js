import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Action } from '@pubsweet/ui'
import { Flex, Box } from 'grid-styled'

import Icon from './Icon'

const PlusIcon = props => (
  <Icon
    iconName="Plus"
    overrideName="@pubsweet-pending.PeoplePicker.PersonPod.add"
    {...props}
  />
)

const StyledPlusIcon = styled(PlusIcon)`
  fill: ${th('colorTextSecondary')};
  height: ${th('space.3')}
  width: ${th('space.3')}
`

const RubbishBinIcon = props => (
  <Icon
    iconName="Trash"
    overrideName="@pubsweet-pending.PeoplePicker.PersonPod.remove"
    {...props}
  />
)

const StyledRubbishBinIcon = styled(RubbishBinIcon)`
  fill: ${th('colorTextSecondary')};
  height: ${th('space.3')}
  width: ${th('space.3')}
`

const SelectedTickIcon = props => (
  <Icon
    iconName="CheckCircle"
    overrideName="@pubsweet-pending.PeoplePicker.PersonPod.selected"
    {...props}
  />
)

const StyledSelectedTickIcon = styled(SelectedTickIcon)`
  circle {
    fill: ${th('colorPrimary')};
  }
  height: ${th('space.4')}
  width: ${th('space.4')}
`

const StyledButton = styled.button`
  background-color: inherit;
  height: 100%;
  width: ${th('space.5')};
  border: none;

  &:hover ${StyledPlusIcon}, &:hover ${StyledRubbishBinIcon} {
      fill: #666666;
    }

  &:hover ${StyledSelectedTickIcon} > circle {
      fill: #1378bb;
    }
  }
`

const RegularP = styled.p`
  font-size: ${th('fontSizeBase')};
  line-height: ${th('fontLineHeightBase')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`

const SmallP = styled.p`
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('fontLineHeightBaseSmall')};
  // vertical spacing of 6px comes from: 24px grid - fontLineHeightBaseSmall
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 3px 0;
`

const SmallAction = styled(Action)`
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('fontLineHeightBaseSmall')};
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
      return <StyledRubbishBinIcon />
    case 'selected':
      return <StyledSelectedTickIcon />
    case 'add':
    default:
      return <StyledPlusIcon />
  }
}

const PersonText = ({
  name,
  institution,
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
      <RegularP>{institution}</RegularP>
      <SmallP>{separatedKeywords}</SmallP>
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
  institution: PropTypes.string.isRequired,
  keywords: PropTypes.arrayOf(PropTypes.string.isRequired),
  isKeywordClickable: PropTypes.bool.isRequired,
  onKeywordClick: PropTypes.func,
  isStatusShown: PropTypes.bool,
  status: PropTypes.string,
}

PersonText.defaultProps = {
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
