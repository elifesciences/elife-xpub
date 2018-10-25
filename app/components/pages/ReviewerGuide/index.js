import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import SideNavLayout from '../../global/layout/SideNavLayout'
import ReviewProcess from './ReviewProcess'
import ReviewingPolicies from './ReviewingPolicies'
import WritingTheReview from './WritingTheReview'

const ReviewerGuide = ({ match, ...props }) => (
  <SideNavLayout
    navList={[
      { label: 'Review Process', link: '/reviewer-guide/review-process' },
      {
        label: 'Reviewing Policies',
        link: '/reviewer-guide/reviewing-policies',
      },
      {
        label: 'Writing The Review',
        link: '/reviewer-guide/writing-the-review',
      },
    ]}
    {...props}
  >
    <Switch>
      <Route
        component={ReviewProcess}
        exact
        path="/reviewer-guide/review-process"
      />
      <Route
        component={ReviewingPolicies}
        exact
        path="/reviewer-guide/reviewing-policies"
      />
      <Route
        component={WritingTheReview}
        exact
        path="/reviewer-guide/writing-the-review"
      />
      <Redirect
        exact
        from="/reviewer-guide"
        to="/reviewer-guide/review-process"
      />
    </Switch>
  </SideNavLayout>
)

export default ReviewerGuide
