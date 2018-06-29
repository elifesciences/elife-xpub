import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Formik } from 'formik'
import WithCurrentSubmission from './WithCurrentSubmission'
import AutoSave from './AutoSave'
import AuthorDetailsPage from './AuthorDetails/AuthorDetailsPage'
import FileUploadsPage from './FileUploads/FileUploadsPage'
import ManuscriptMetadata from './ManuscriptMetadata/ManuscriptMetadata'
import ReviewerSuggestions from './ReviewerSuggestions/ReviewerSuggestions'
import { schema as fileUploadsSchema } from './FileUploads/FileUploadsSchema'
import { schema as authorDetailsSchema } from './AuthorDetails/AuthorDetailsSchema'
import { schema as manuscriptMetadataSchema } from './ManuscriptMetadata/ManuscriptMetadataSchema'
import { schema as reviewerSuggestionsSchema } from './ReviewerSuggestions/ReviewerSuggestionsSchema'

const FormStep = ({
  component: FormComponent,
  handleSubmit,
  handleUpdate,
  history,
  nextUrl,
  initialValues,
  validationSchema,
}) => (
  <Formik
    initialValues={initialValues}
    // ensure each page gets a new form instance otherwise all fields are touched
    key={FormComponent.name}
    onSubmit={values => handleSubmit(values).then(() => history.push(nextUrl))}
    render={formProps => (
      <AutoSave onSave={handleUpdate} values={formProps.values}>
        <FormComponent {...formProps} />
      </AutoSave>
    )}
    validationSchema={validationSchema}
  />
)

const SubmissionPage = ({ match, history }) => (
  <WithCurrentSubmission>
    {({
      initialValues,
      updateSubmission,
      progressSubmission,
      finishSubmission,
    }) => (
      <Switch>
        <Route
          exact
          path={`${match.path}/upload`}
          render={() => (
            <FormStep
              component={FileUploadsPage}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/metadata`}
              validationSchema={fileUploadsSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/metadata`}
          render={() => (
            <FormStep
              component={ManuscriptMetadata}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/suggestions`}
              validationSchema={manuscriptMetadataSchema}
            />
          )}
        />
        <Route
          path={`${match.path}/suggestions`}
          render={() => (
            <FormStep
              component={ReviewerSuggestions}
              handleSubmit={finishSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl="/dashboard"
              validationSchema={reviewerSuggestionsSchema}
            />
          )}
        />
        <Route
          render={() => (
            <FormStep
              component={AuthorDetailsPage}
              handleSubmit={progressSubmission}
              handleUpdate={updateSubmission}
              history={history}
              initialValues={initialValues}
              nextUrl={`${match.path}/upload`}
              validationSchema={authorDetailsSchema}
            />
          )}
        />
      </Switch>
    )}
  </WithCurrentSubmission>
)

export default SubmissionPage
