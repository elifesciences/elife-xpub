import React from 'react'
import { Flex, Box } from 'grid-styled'
import { H1 } from '@pubsweet/ui'
import LoginButton from '@elife/login-orcid/Login'

const LoginPage = ({ location }) => (
  <Flex>
    <Box mx="auto" width={[1, 1 / 2]}>
      <H1>Sign in to eLife xPub</H1>
      <LoginButton location={location} />
    </Box>
  </Flex>
)

export default LoginPage
