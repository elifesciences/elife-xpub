import React from 'react'
import Manuscript from './Manuscript'

export default ({ match }) => <Manuscript archiveId={match.params.id} />
