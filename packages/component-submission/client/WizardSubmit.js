import React from 'react'
import { H2, Button } from '@pubsweet/ui'
import ModalDialog from 'ui/molecules/ModalDialog'
import ModalHistoryState from 'ui/molecules/ModalHistoryState'

const WizardSubmit = ({ setTouched, submitForm, validateForm }) => (
  <ModalHistoryState>
    {({ showModal, hideModal, isModalVisible }) => (
      <React.Fragment>
        <Button
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
        </Button>
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
