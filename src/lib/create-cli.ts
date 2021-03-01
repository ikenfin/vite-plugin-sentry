import SentryCli from '@sentry/cli'
import { ViteSentryPluginOptions } from '../../index'
import { createFakeCli } from './create-fake-cli'

/*
  Initialize and return SentryCli instance
  On dryRun enabled - returns fake sentryCli
*/
export const createSentryCli = (options: ViteSentryPluginOptions) => {
  const defaults = {
    debug: false,
    finalize: true,
    rewrite: true
  }

  const sentryOptions = Object.assign({}, defaults, options)

  /*
    Initialize sentry cli
  */
  const cli = new SentryCli(options.configFile, {
    authToken: sentryOptions.authToken,
    org: sentryOptions.org,
    project: sentryOptions.project,
    silent: sentryOptions.silent ?? false,
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
