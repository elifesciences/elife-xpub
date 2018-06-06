import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Formik } from 'formik'
import omitDeep from 'omit-deep-lodash'
import _ from 'lodash'
import WithCurrentSubmission from './WithCurrentSubmission'
import AuthorDetailsPage from './AuthorDetails/AuthorDetailsPage'
import FileUploadsPage from './FileUploads/FileUploadsPage'
import ManuscriptMetadata from './ManuscriptMetadata/ManuscriptMetadata'
import ReviewerSuggestions from './ReviewerSuggestions/ReviewerSuggestions'
import { schema as fileUploadsSchema } from './FileUploads/FileUploadsSchema'
import { schema as authorDetailsSchema } from './AuthorDetails/AuthorDetailsSchema'
import { schema as manuscriptMetadataSchema } from './ManuscriptMetadata/ManuscriptMetadataSchema'
import { schema as reviewerSuggestionsSchema } from './ReviewerSuggestions/ReviewerSuggestionsSchema'

function storeFormData(oldValues, values, updateSubmission) {
  if (_.isEqual(oldValues, values)) {
    return false
  }
  const data = omitDeep(values, ['__typename', 'files'])
  updateSubmission({ variables: { data } })
  return true
}

const FormStep = ({ history, nextUrl, updateSubmission, ...props }) => (
  <Formik
    onSubmit={(values, { setSubmitting, setErrors }) => {
      const data = omitDeep(values, ['__typename', 'files'])
      return updateSubmission({ variables: { data } })
        .then(() => setSubmitting(false))
        .then(() => history.push(nextUrl))
        .catch(errors => {
          setErrors(errors)
        })
    }}
    {...props}
  />
)

const SubmissionPage = ({ match, history }) => {
  // TODO update interval in ms - define this somewhere else
  const updateInterval = 5000
  return (
    <WithCurrentSubmission>
      {(updateSubmission, initialValues) => (
        <Switch>
          <Route
            path={`${match.path}/upload`}
            render={() => (
              <FormStep
                history={history}
                initialValues={initialValues}
                nextUrl={`${match.path}/metadata`}
                render={props => (
                  <FileUploadsPage
                    storeFormData={(oldValues, values) =>
                      storeFormData(oldValues, values, updateSubmission)
                    }
                    updateInterval={updateInterval}
                    {...props}
                  />
                )}
                updateSubmission={updateSubmission}
                validationSchema={fileUploadsSchema}
              />
            )}
          />
          <Route
            path={`${match.path}/metadata`}
            render={() => (
              <FormStep
                history={history}
                initialValues={initialValues}
                nextUrl={`${match.path}/suggestions`}
                render={props => (
                  <ManuscriptMetadata
                    storeFormData={(oldValues, values) =>
                      storeFormData(oldValues, values, updateSubmission)
                    }
                    updateInterval={updateInterval}
                    {...props}
                  />
                )}
                updateSubmission={updateSubmission}
                validationSchema={manuscriptMetadataSchema}
              />
            )}
          />
          <Route
            path={`${match.path}/suggestions`}
            render={() => (
              <FormStep
                history={history}
                initialValues={initialValues}
                nextUrl="/dashboard"
                render={props => (
                  <ReviewerSuggestions
                    storeFormData={(oldValues, values) =>
                      storeFormData(oldValues, values, updateSubmission)
                    }
                    updateInterval={updateInterval}
                    {...props}
                  />
                )}
                updateSubmission={updateSubmission}
                validationSchema={reviewerSuggestionsSchema}
              />
            )}
          />
          <Route
            render={() => (
              <FormStep
                history={history}
                initialValues={initialValues}
                nextUrl={`${match.path}/upload`}
                render={props => (
                  <AuthorDetailsPage
                    storeFormData={(oldValues, values) =>
                      storeFormData(oldValues, values, updateSubmission)
                    }
                    updateInterval={updateInterval}
                    {...props}
                  />
                )}
                updateSubmission={updateSubmission}
                validationSchema={authorDetailsSchema}
              />
            )}
          />
        </Switch>
      )}
    </WithCurrentSubmission>
  )
}

export default SubmissionPage
