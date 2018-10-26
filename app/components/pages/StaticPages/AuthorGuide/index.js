import React from 'react'

import StaticPage from '../.'
import EditorialProcess from './EditorialProcess'
import Types from './Types'
import Initial from './Initial'
import Full from './Full'
import Revised from './Revised'
import Post from './Post'
import JournalPolicies from './JournalPolicies'
import Fees from './Fees'
import JournalMetrics from './JournalMetrics'

const AuthorGuide = props => (
  <StaticPage
    navList={[
      {
        label: 'Editorial Process',
        link: '/author-guide/editorial-process',
        component: EditorialProcess,
      },
      { label: 'Article Types', link: '/author-guide/types', component: Types },
      {
        label: 'Initial Submissions',
        link: '/author-guide/initial',
        component: Initial,
      },
      {
        label: 'Full Submissions',
        link: '/author-guide/full',
        component: Full,
      },
      {
        label: 'Revised Submissions',
        link: '/author-guide/revised',
        component: Revised,
      },
      { label: 'Post Decision', link: '/author-guide/post', component: Post },
      {
        label: 'Journal Policies',
        link: '/author-guide/journal-policies',
        component: JournalPolicies,
      },
      {
        label: 'Publication Fees',
        link: '/author-guide/fees',
        component: Fees,
      },
      {
        label: 'Journal Metrics',
        link: '/author-guide/journal-metrics',
        component: JournalMetrics,
      },
    ]}
    {...props}
  />
)

export default AuthorGuide
