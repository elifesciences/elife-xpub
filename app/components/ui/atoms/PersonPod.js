import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Action } from '@pubsweet/ui'
import { Flex, Box } from 'grid-styled'

import Icon from './Icon'
import ButtonAsIconWrapper from './ButtonAsIconWrapper'
import SmallParagraph from './SmallParagraph'
import Paragraph from './Paragraph'
import PersonInfo from './PersonInfo'
import ModalDialog from '../molecules/ModalDialog'

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

const StyledParagraph = styled(Paragraph)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`

const StyledSmallParagraph = styled(SmallParagraph).attrs({ secondary: true })`
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
  isSelectButtonClickable,
  togglePersonSelection,
  selectButtonType,
  children,
  ...props
}) => (
  <StyledPod justifyContent="space-between">
    {children}
    <Flex flexDirection="column" justifyContent="center">
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
    </Flex>
  </StyledPod>
)

class PersonPod extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isModalOpen: false,
    }
  }

  openModal = () => {
    this.setState({ isModalOpen: true })
  }

  acceptModal = person => {
    this.setState({ isModalOpen: false })
    this.props.togglePersonSelection(person)
  }

  cancelModal = () => {
    this.setState({ isModalOpen: false })
  }

  render() {
    const {
      isSelectButtonClickable = true,
      togglePersonSelection,
      selectButtonType,
      name,
      institution = '',
      focuses,
      expertises,
      isKeywordClickable,
      isSelected,
      onKeywordClick = null,
      isStatusShown = false,
      status = '',
    } = this.props

    let keywordList
    const keywords = [].concat(focuses).concat(expertises)
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
      <React.Fragment>
        <ModalDialog
          acceptText={isSelected ? 'Remove editor' : 'Add editor'}
          cancelText="Cancel"
          onAccept={this.acceptModal}
          onCancel={this.cancelModal}
          open={this.state.isModalOpen}
        >
          <PersonInfo
            expertises={expertises}
            focuses={focuses}
            institution={institution}
            name={name}
          />
        </ModalDialog>
        <PersonPodContainer
          isSelectButtonClickable={isSelectButtonClickable}
          selectButtonType={selectButtonType}
          togglePersonSelection={togglePersonSelection}
        >
          <CollapsibleBox m={2}>
            <StyledParagraph>{name}</StyledParagraph>
            {institution && <StyledParagraph>{institution}</StyledParagraph>}
            {!institution && <Box mb={3} />}
            <Flex alignItems="center">
              <ButtonAsIconWrapper onClick={this.openModal}>
                <StyledInfoIcon />
              </ButtonAsIconWrapper>
              <StyledSmallParagraph>{separatedKeywords}</StyledSmallParagraph>
            </Flex>
            {isStatusShown && (
              <StyledSmallParagraph>{status}</StyledSmallParagraph>
            )}
          </CollapsibleBox>
        </PersonPodContainer>
      </React.Fragment>
    )
  }
}

const ChooserPod = ({
  roleName,
  isRequired,
  isSelectButtonClickable,
  togglePersonSelection,
  ...props
}) => (
  <PersonPodContainer
    isSelectButtonClickable
    selectButtonType="add"
    togglePersonSelection={togglePersonSelection}
  >
    <Flex flexDirection="column" justifyContent="center">
      <Box ml={2}>
        <StyledParagraph>
          Choose {roleName} ({isRequired ? 'required' : 'optional'})
        </StyledParagraph>
      </Box>
    </Flex>
  </PersonPodContainer>
)

PersonPodContainer.propTypes = {
  isSelectButtonClickable: PropTypes.bool.isRequired,
  togglePersonSelection: PropTypes.func.isRequired,
  selectButtonType: PropTypes.oneOf(['add', 'remove', 'selected']).isRequired,
}

PersonPod.propTypes = {
  isSelectButtonClickable: PropTypes.bool,
  togglePersonSelection: PropTypes.func.isRequired,
  selectButtonType: PropTypes.oneOf(['add', 'remove', 'selected']).isRequired,
  name: PropTypes.string.isRequired,
  institution: PropTypes.string,
  focuses: PropTypes.arrayOf(PropTypes.string.isRequired),
  expertises: PropTypes.arrayOf(PropTypes.string.isRequired),
  isKeywordClickable: PropTypes.bool.isRequired,
  onKeywordClick: PropTypes.func,
  isStatusShown: PropTypes.bool,
  isSelected: PropTypes.bool.isRequired,
  status: PropTypes.string,
}

PersonPod.defaultProps = {
  isSelectButtonClickable: true,
  institution: '',
  focuses: [],
  expertises: [],
  onKeywordClick: null,
  isStatusShown: false,
  status: '',
}

ChooserPod.propTypes = {
  roleName: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  togglePersonSelection: PropTypes.func.isRequired,
}

PersonPod.ChooserPod = ChooserPod

export default PersonPod
