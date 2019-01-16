import React from 'react'
import { H2 } from '@pubsweet/ui'
import ButtonBase from '../../ui/atoms/ButtonBase'
import ModalDialog from '../../ui/molecules/ModalDialog'
import ModalHistoryState from '../../ui/molecules/ModalHistoryState'

const WizardSubmit = ({ setTouched, submitForm, validateForm }) => (
  <ModalHistoryState>
    {({ showModal, hideModal, isModalVisible }) => (
      <React.Fragment>
        <ButtonBase
          data-test-id="submit"
          onClick={() =>
            validateForm().then(errors => {
              if (Object.keys(errors).length) {
                setTouched(errors)
              } else {
                showModal()
              }
            })
          }
          primary
          type="button"
        >
          Submit
        </ButtonBase>
        <ModalDialog
          acceptText="Confirm"
          onAccept={submitForm}
          onCancel={hideModal}
          open={isModalVisible()}
        >
          <H2>Confirm submission?</H2>
          Your initial submission will be sent for editorial assessment. You
          will be unable to make changes after this point.
        </ModalDialog>
      </React.Fragment>
    )}
  </ModalHistoryState>
)

export default WizardSubmit
