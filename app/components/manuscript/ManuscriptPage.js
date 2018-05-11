import React from 'react'
import Manuscript from './Manuscript'

export default ({ location }) => (
  <Manuscript archiveId={location.search.replace('?archiveId=', '')} />
)
