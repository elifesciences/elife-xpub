import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { ALL_MANUSCRIPTS } from '@elifesciences/component-dashboard/client/graphql/queries'
import { getSubmission } from './queries'
import {
  updateSubmission,
  SUBMIT_MANUSCRIPT,
  UPLOAD_MANUSCRIPT_FILE,
  DELETE_MANUSCRIPT_FILE,
  UPLOAD_SUPPORTING_FILE,
  DELETE_SUPPORTING_FILES,
} from './mutations'
import { ON_UPLOAD_PROGRESS } from './subscriptions'

export default compose(
  graphql(getSubmission, {
    options: props => ({ variables: { id: props.match.params.id } }),
  }),
  graphql(updateSubmission, {
    name: 'updateSubmission',
    refetchQueries: [{ query: ALL_MANUSCRIPTS }],
  }),
  graphql(SUBMIT_MANUSCRIPT, {
    name: 'submitManuscript',
    refetchQueries: [{ query: ALL_MANUSCRIPTS }],
  }),
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
    options: props => ({ variables: { id: props.match.params.id } }),
  }),
)
