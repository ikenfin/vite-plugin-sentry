import type { Plugin } from 'vite'
import { createLogger } from 'vite'
import { ViteSentryCliOptions } from '../index'
import { createSentryCli, getReleasePromise } from './lib/create-cli'

export default function ViteSentry (options: ViteSentryCliOptions) {
  const cli = createSentryCli(options)
  const release = getReleasePromise(cli, options)

  const logger = createLogger()

  // is plugin enabled
  let enabled: Boolean = false

  const viteSentryPlugin: Plugin = {
    name: 'sentry',
    enforce: 'post',
    apply: 'build',
    configResolved (config) {
      if (config.isProduction && config.build.sourcemap) {
        enabled = true
      }
      else if (!config.isProduction) {
        logger.error('[vite-plugin-sentry] skipped for non production build!')
      }
      else if (!config.build.sourcemap) {
        logger.error(
          '[vite-plugin-sentry] ViteSentry skipped because [options.sourcemap] is not enabled!'
        )
      }

      return null
    },
    async closeBundle () {
      if (enabled) {
        let currentRelease: string

        release
          .then((release: string) => {
            currentRelease = release
            return cli.releases.new(currentRelease)
          })
          .then(() => {
            return cli.releases.uploadSourceMaps(
              currentRelease,
              options.sourceMaps
            )
          })
          .then(() => {
            const { commit, repo, auto } = options.setCommits

            if (auto || (repo && commit)) {
              return cli.releases.setCommits(currentRelease, options.setCommits)
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
            const { env } = options.deploy || {}

            if (env) {
              return cli.releases.newDeploy(currentRelease, options.deploy)
            }

            return undefined
          })
          .catch((error: Error) => {
            logger.error(`[vite-plugin-sentry] Error: ${error.message}`)
          })
      }
    }
  }

  return viteSentryPlugin
}
