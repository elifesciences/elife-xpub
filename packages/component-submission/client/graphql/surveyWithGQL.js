import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { submitSurveyResponse } from './mutations'

export default compose(graphql(submitSurveyResponse))
