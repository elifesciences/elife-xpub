import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Route } from 'react-router-dom'
import { Formik } from 'formik'
import FileUploads from './FileUploads'
import { empty, schema } from './FileUploadsSchema'

const UPLOAD_MUTATION = gql`
  mutation UploadFile($file: Upload!) {
    upload(file: $file) {
      url
    }
  }
`

const FileUploadsPage = () => (
  <Route>
    {({ history }) => (
      <Mutation mutation={UPLOAD_MUTATION}>
        {(uploadFile, { data, loading, error: uploadError }) => (
          <Formik
            initialValues={empty}
            onSubmit={() => history.push('/submit/metadata')}
            validationSchema={schema}
          >
            {({ setFieldValue, errors, touched, ...props }) => (
              <FileUploads
                conversion={{
                  converting: loading,
                  completed: !!data,
                  // display either upload error or form validation error
                  error: uploadError,
                }}
                formError={
                  errors.manuscriptUrl &&
                  touched.manuscriptUrl &&
                  new Error(errors.manuscriptUrl)
                }
                onDrop={([file]) =>
                  uploadFile({ variables: { file } }).then(
                    // save file URL to form on success
                    ({
                      data: {
                        upload: { url },
                      },
                    }) => setFieldValue('manuscriptUrl', url),
                  )
                }
                setFieldValue={setFieldValue}
                {...props}
              />
            )}
          </Formik>
        )}
      </Mutation>
    )}
  </Route>
)

export default FileUploadsPage
