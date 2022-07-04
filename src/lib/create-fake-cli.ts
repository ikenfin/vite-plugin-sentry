import type SentryCli from '@sentry/cli'
import type { SentryCliReleases } from '@sentry/cli'

import { debugLogger } from './debug-logger'

/*
  Fake sentry cli - it just prints info on actions
*/
export const createFakeCli = (cli: SentryCli, debug = debugLogger) => {
  const releases: SentryCliReleases = {
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
    },
    listDeploys: function (release: string): Promise<string> {
      throw new Error('Function not implemented.')
    },
    execute: function (args: string[], live: boolean): Promise<string> {
      throw new Error('Function not implemented.')
    }
  }

  const DummySentryCli: SentryCli = {
    releases,
    execute: function (args: string[], live: boolean): Promise<string> {
      throw new Error('Function not implemented.')
    }
  }

  return DummySentryCli
}
