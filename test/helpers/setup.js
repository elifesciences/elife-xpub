// idea: this might be another option for when running browser tests
// while writing tests, using the following to start the server avoids having to recompile the app
// import {startServer: start} from 'pubsweet-server'

import replaySetup from './replay-setup'

export async function setup(t) {
  replaySetup('success')
}
