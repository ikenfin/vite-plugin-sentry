import { ViteSentryCliOptions } from '../index'
import { createSentryCli, getReleasePromise } from './lib/create-cli'

export default function ViteSentry (options: ViteSentryCliOptions) {
  const cli = createSentryCli(options)
  const release = getReleasePromise(cli, options)

  return {
    name: 'sentry',
    enforce: 'post',
    apply: 'build',
    async closeBundle (error: Error) {
      if (!error) {
        let currentRelease: string

        return release
          .then((release: string) => {
            currentRelease = release
            console.log('RELEEASE release:', currentRelease)
            return cli.releases.new(currentRelease)
          })
          .then(() => {
            return cli.releases.uploadSourceMaps(
              currentRelease,
              options.sourceMapsConfig
            )
          })
          .then(() => {
            const { commit, repo, auto } = options.commitsConfig

            if (auto || (repo && commit)) {
              return cli.releases.setCommits(
                currentRelease,
                options.commitsConfig
              )
            }

            return undefined
          })
          .then(() => {
            if (options.finalize) {
              return cli.releases.finalize(currentRelease)
            }
            return undefined
          })
          .then(() => {
            const { env } = options.deployConfig || {}

            if (env) {
              return cli.releases.newDeploy(
                currentRelease,
                options.deployConfig
              )
            }

            return undefined
          })
          .catch((error: Error) => {
            console.error('err:', error)
            options.errorHandler?.(error, console.error)
          })
      }
    }
  }
}
