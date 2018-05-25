import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import omitDeep from 'omit-deep-lodash'
import { Formik } from 'formik'
import FileUploads from './FileUploads'
import { schema } from './FileUploadsSchema'
import WithCurrentSubmission from '../WithCurrentSubmission'

const UPLOAD_MUTATION = gql`
  mutation UploadFile($id: ID!, $file: Upload!) {
    uploadManuscript(id: $id, file: $file) {
      id
      title
      files {
        name
        type
      }
    }
  }
`

const FileUploadsPage = ({ history }) => (
  <WithCurrentSubmission>
    {(updateSubmission, initialValues) => (
      <Mutation mutation={UPLOAD_MUTATION}>
        {(uploadFile, { data: uploadData, loading, error: uploadError }) => (
          <Formik
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              const data = omitDeep(values, ['__typename', 'files'])
              return updateSubmission({ variables: { data } })
                .then(() => setSubmitting(false))
                .then(() => history.push('/submit/metadata'))
                .catch(errors => {
                  setErrors(errors)
                })
            }}
            validationSchema={schema}
          >
            {({ setFieldValue, errors, touched, values, ...props }) => {
              const fieldName = 'files'
              return (
                <FileUploads
                  conversion={{
                    converting: loading,
                    // TODO import this constant from somewhere (data model package?)
                    completed: values[fieldName].includes(
                      file => file.type === 'MANUSCRIPT_SOURCE',
                    ),
                    error: uploadError,
                  }}
                  formError={errors[fieldName] && touched[fieldName]}
                  onDrop={([file]) =>
                    uploadFile({
                      variables: { file, id: initialValues.id },
                    }).then(({ data }) => {
                      setFieldValue('title', data.uploadManuscript.title)
                      setFieldValue(fieldName, data.uploadManuscript.files)
                    })
                  }
                  setFieldValue={setFieldValue}
                  {...props}
                />
              )
            }}
          </Formik>
        )}
      </Mutation>
    )}
  </WithCurrentSubmission>
)

export default FileUploadsPage
