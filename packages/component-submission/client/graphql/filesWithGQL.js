import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import {
  UPLOAD_MANUSCRIPT_FILE,
  DELETE_MANUSCRIPT_FILE,
  UPLOAD_SUPPORTING_FILE,
  DELETE_SUPPORTING_FILES,
} from './mutations'

import { ON_UPLOAD_PROGRESS } from './subscriptions'

import graphqlMemoWrapper from './graphqlMemoWrapper'

export default compose(
  graphql(UPLOAD_MANUSCRIPT_FILE, {
    name: 'uploadManuscriptFile',
  }),
  graphql(DELETE_MANUSCRIPT_FILE, {
    name: 'deleteManuscriptFile',
  }),
  graphql(UPLOAD_SUPPORTING_FILE, {
    name: 'uploadSupportingFile',
  }),
  graphql(DELETE_SUPPORTING_FILES, {
    name: 'deleteSupportingFiles',
  }),
  graphql(ON_UPLOAD_PROGRESS, {
    name: 'uploadProgress',
    options: props => ({ variables: { id: props.initialValues.id } }),
  }),
  graphqlMemoWrapper,
)
