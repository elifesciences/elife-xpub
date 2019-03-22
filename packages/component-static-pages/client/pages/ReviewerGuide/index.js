import React from 'react'

import Layout from '../../components/Layout'
import ReviewProcess from './ReviewProcess'
import ReviewingPolicies from './ReviewingPolicies'
import WritingTheReview from './WritingTheReview'

const ReviewerGuide = props => (
  <Layout
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
