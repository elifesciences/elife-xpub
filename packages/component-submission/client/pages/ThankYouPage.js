import React from 'react'
import { compose, branch, renderComponent } from 'recompose'
import styled from 'styled-components'
import { Box } from '@rebass/grid'
import config from 'config'
import { H1 } from '@pubsweet/ui'
import { ErrorPage } from '@elifesciences/component-elife-app/client'
import {
  NativeLink,
  ButtonLink,
  Paragraph,
  Loading,
} from '@elifesciences/component-elife-ui/client/atoms'

import thankYouWithGQL from '../graphql/thankYouWithGQL'

const CenteredContent = styled(Box)`
  text-align: center;
`

const BookmarkLink = styled(NativeLink)`
  display: inline-block;
  clear: both;
`

export class ThankYouPageComponent extends React.Component {
  componentDidMount() {
    if (config.hotJar.enabled) {
      window.hj('trigger', 'thank_you_page_hotjar_feedback')
    }
  }

  render() {
    const { data } = this.props
    return (
      <CenteredContent mx="auto" width={[1, 1, 1, 600]}>
        <H1>Thank you</H1>
        <Paragraph.Reading data-hj-suppress="" data-test-id="title">
          Your submission, &quot;
          {data.manuscript.meta.title}
          &quot; has been received.
        </Paragraph.Reading>
        <Paragraph.Reading>
          You will be informed of a decision soon.
        </Paragraph.Reading>
        <Paragraph.Small secondary>
          You may want to bookmark the link below to check the progress of your
          submission.
          <BookmarkLink href="/">elifesciences.org/submissions</BookmarkLink>
        </Paragraph.Small>
        <ButtonLink
          data-test-id="finish"
          primary
          to={
            config.features && config.features.demographicSurvey
              ? `/survey/${data.manuscript.id}`
              : '/'
          }
        >
          Finish
        </ButtonLink>
      </CenteredContent>
    )
  }
}

export default compose(
  thankYouWithGQL,
  branch(props => props.data && props.data.loading, renderComponent(Loading)),
  branch(props => !props.data || props.data.error, renderComponent(ErrorPage)),
)(ThankYouPageComponent)
