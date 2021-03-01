import SentryCli from '@sentry/cli'
import { debugLogger } from './debug-logger'

/*
  Fake sentry cli - it just prints info on actions
*/
export const createFakeCli = (cli: SentryCli, debug = debugLogger) => {
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
