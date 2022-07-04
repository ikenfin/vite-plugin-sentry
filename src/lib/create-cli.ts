import type { ViteSentryCliOptions } from '../..'

import SentryCli from '@sentry/cli'
import { createFakeCli } from './create-fake-cli'

/*
  Initialize and return SentryCli instance
  On dryRun enabled - returns fake sentryCli
*/

export const createSentryCli = (options: ViteSentryCliOptions) => {
  const sentryOptions = Object.assign({
    silent: false
  }, options)

  /*
    Initialize sentry cli
  */
  const cli = new SentryCli(options.configFile, {
    authToken: sentryOptions.authToken,
    org: sentryOptions.org,
    project: sentryOptions.project,
    silent: sentryOptions.silent,
    url: sentryOptions.url,
    vcsRemote: sentryOptions.vcsRemote
  })

  /*
    Return fake sentry cli to run in dry mode
  */
  if (options.dryRun) {
    return createFakeCli(cli)
  }

  return cli
}
