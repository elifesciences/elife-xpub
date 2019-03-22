import React from 'react'

import StaticPage from '../.'
import ReviewProcess from './ReviewProcess'
import ReviewingPolicies from './ReviewingPolicies'
import WritingTheReview from './WritingTheReview'

const ReviewerGuide = props => (
  <StaticPage
    navList={[
      {
        label: 'Review Process',
        link: '/reviewer-guide/review-process',
        component: ReviewProcess,
      },
      {
        label: 'Reviewing Policies',
        link: '/reviewer-guide/reviewing-policies',
        component: ReviewingPolicies,
      },
      {
        label: 'Writing The Review',
        link: '/reviewer-guide/writing-the-review',
        component: WritingTheReview,
      },
    ]}
    {...props}
  />
)

export default ReviewerGuide
