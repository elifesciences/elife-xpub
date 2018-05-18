import React from 'react'
import styled from 'styled-components'
import { Heading, th } from '@pubsweet/ui'

const formatErrorMessage = error => {
  if (error instanceof Error) {
    return error.message
  }
  return error
}

const Container = styled.div`
  text-align: center;
`

const Img = styled.img`
  height: calc(${th('gridUnit')} * 4);
`

const ErrorPage = ({ error }) => (
  <Container>
    <Img alt="Test tube experiment" src="/assets/error.svg" />
    <Heading level={1}>Oops!</Heading>
    <Heading level={2}>Something is wrong</Heading>
    <pre>{formatErrorMessage(error)}</pre>
    <a href="/">Back to homepage</a>
  </Container>
)

export default ErrorPage
