import SentryCli from '@sentry/cli'
import { ViteSentryCliOptions } from '../../index'
import { debugLogger } from './debug-logger'

export const createSentryCli = (options: ViteSentryCliOptions) => {
  const defaults = {
    debug: false,
    finalize: true,
    rewrite: true
  }

  const sentryOptions = Object.assign({}, defaults, options)

  const cli = new SentryCli(options.configFile, {
    authToken: sentryOptions.authToken,
    org: sentryOptions.org,
    project: sentryOptions.project,
    silent: sentryOptions.silent ?? false,
    url: sentryOptions.url,
    vcsRemote: sentryOptions.vcsRemote
  })

  const debug = options.debug ? debugLogger : () => {}

  // copied from sentry webpack plugin
  if (options.dryRun) {
    const DummySentryCli: SentryCli = {
      releases: {
        proposeVersion: () =>
          cli.releases.proposeVersion().then((version) => {
            debug('Proposed version:\n', version)
            return version
          }),
        new: (release) => {
          debug('Creating new release:\n', release)
          return Promise.resolve(release)
        },
        uploadSourceMaps: (release, config) => {
          debug('Calling upload-sourcemaps with:\n', config)
          return Promise.resolve(release)
        },
        finalize: (release) => {
          debug('Finalizing release:\n', release)
          return Promise.resolve(release)
        },
        setCommits: (release, config) => {
          debug('Calling set-commits with:\n', config)
          return Promise.resolve(release)
        },
        newDeploy: (release, config) => {
          debug('Calling deploy with:\n', config)
          return Promise.resolve(release)
        }
      }
    }

    return DummySentryCli
  }

  return cli
}

export const getReleasePromise = (
  cli: SentryCli,
  options: ViteSentryCliOptions
) => {
  return (options.release
    ? Promise.resolve(options.release)
    : cli.releases.proposeVersion()
  )
    .then((version: string) => `${version}`.trim())
    .catch(() => undefined)
}
