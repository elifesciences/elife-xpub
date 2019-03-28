import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Flex } from '@rebass/grid'

import Icon from '@elifesciences/component-elife-ui/client/atoms/Icon'

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

// This is needed for legacy safari support
const ButtonContainer = styled(Flex).attrs({
  flexDirection: 'column',
  justifyContent: 'center',
})`
  height: 100%;
`

const PodContainer = ({
  isSelectButtonClickable,
  togglePersonSelection,
  selectButtonType,
  children,
  ...props
}) => (
  <StyledPod justifyContent="space-between">
    {children}
    <ButtonContainer>
      {selectButtonType === 'remove' && (
        <StyledButton
          data-test-id="person-pod-button"
          disabled={!isSelectButtonClickable}
          onClick={togglePersonSelection}
          type="button"
        >
          <StyledRemoveIcon />
        </StyledButton>
      )}
      {selectButtonType === 'selected' && (
        <StyledButton
          data-test-id="person-pod-button"
          disabled={!isSelectButtonClickable}
          onClick={togglePersonSelection}
          type="button"
        >
          <StyledSelectedIcon />
        </StyledButton>
      )}
      {selectButtonType === 'add' && (
        <StyledButton
          data-test-id="person-pod-button"
          disabled={!isSelectButtonClickable}
          onClick={togglePersonSelection}
          type="button"
        >
          <StyledAddIcon />
        </StyledButton>
      )}
    </ButtonContainer>
  </StyledPod>
)

PodContainer.propTypes = {
  isSelectButtonClickable: PropTypes.bool.isRequired,
  togglePersonSelection: PropTypes.func.isRequired,
  selectButtonType: PropTypes.oneOf(['add', 'remove', 'selected']).isRequired,
  children: PropTypes.node.isRequired,
}

export default PodContainer
