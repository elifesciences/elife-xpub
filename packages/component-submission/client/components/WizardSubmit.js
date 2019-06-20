import React from 'react'
import { H2, Button } from '@pubsweet/ui'
import {
  ModalDialog,
  ModalHistoryState,
} from '@elifesciences/component-elife-ui/client/molecules'

const WizardSubmit = ({
  touchAllErrorFields,
  submitForm,
  validateForm,
  setSubmissionAttempted,
}) => (
  <ModalHistoryState>
    {({ showModal, hideModal, isModalVisible }) => (
      <React.Fragment>
        <Button
          data-test-id="submit"
          onClick={() => {
            setSubmissionAttempted(true)
            validateForm().then(errors => {
              if (!Object.keys(errors).length) {
                showModal()
              }
              touchAllErrorFields(errors)
            })
          }}
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
