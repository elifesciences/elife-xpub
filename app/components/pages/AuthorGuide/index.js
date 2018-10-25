import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import SideNavLayout from '../../global/layout/SideNavLayout'
import EditorialProcess from './EditorialProcess'
import Types from './Types'
import Initial from './Initial'
import Full from './Full'
import Revised from './Revised'
import Post from './Post'
import JournalPolicies from './JournalPolicies'
import Fees from './Fees'
import JournalMetrics from './JournalMetrics'

const AuthorGuide = ({ match, ...props }) => (
  <SideNavLayout
    navList={[
      { label: 'Editorial Process', link: '/author-guide/editorial-process' },
      { label: 'Article Types', link: '/author-guide/types' },
      { label: 'Initial Submissions', link: '/author-guide/initial' },
      { label: 'Full Submissions', link: '/author-guide/full' },
      { label: 'Revised Submissions', link: '/author-guide/revised' },
      { label: 'Post Decision', link: '/author-guide/post' },
      { label: 'Journal Policies', link: '/author-guide/journal-policies' },
      { label: 'Publication Fees', link: '/author-guide/fees' },
      { label: 'Journal Metrics', link: '/author-guide/journal-metrics' },
    ]}
    {...props}
  >
    <Switch>
      <Route
        component={EditorialProcess}
        exact
        path="/author-guide/editorial-process"
      />
      <Route component={Types} exact path="/author-guide/types" />
      <Route component={Initial} exact path="/author-guide/initial" />
      <Route component={Full} exact path="/author-guide/full" />
      <Route component={Revised} exact path="/author-guide/revised" />
      <Route component={Post} exact path="/author-guide/post" />
      <Route
        component={JournalPolicies}
        exact
        path="/author-guide/journal-policies"
      />
      <Route component={Fees} exact path="/author-guide/fees" />
      <Route
        component={JournalMetrics}
        exact
        path="/author-guide/journal-metrics"
      />
      <Redirect
        exact
        from="/author-guide"
        to="/author-guide/editorial-process"
      />
    </Switch>
  </SideNavLayout>
)

export default AuthorGuide
