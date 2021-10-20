import type { Plugin } from 'vite'
import type { ViteSentryPluginOptions } from '..'

import { createLogger } from 'vite'
import { createSentryCli } from './lib/create-cli'
import { getReleasePromise } from './lib/get-release-promise'

export default function ViteSentry (options: ViteSentryPluginOptions) {
  const cli = createSentryCli(options)
  const logger = createLogger()

  // is plugin enabled
  let enabled: Boolean = false

  const viteSentryPlugin: Plugin = {
    name: 'sentry',
    enforce: 'post',
    apply: 'build',

    /*
      Check incoming config and decise - enable plugin or not
      We don't want enable plugin for non-production environments
      also we dont't want to enable with disabled sourcemaps
    */
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
    },

    /*
      We starting plugin here, because at the moment vite completed with building
      so sourcemaps must be ready
    */
    async closeBundle () {
      if (enabled) {
        const currentRelease = await getReleasePromise(cli, options)

        if (!currentRelease) {
          logger.error(
            '[vite-plugin-sentry] Release returned from sentry is empty! Please check your configs'
          )
        }
        else {
          cli.releases
            .new(currentRelease)
            .then(() => {
              return cli.releases.uploadSourceMaps(
                currentRelease,
                options.sourceMaps
              )
            })
            .then(() => {
              const { commit, repo, auto } = options.setCommits

              if (auto || (repo && commit)) {
                return cli.releases.setCommits(
                  currentRelease,
                  options.setCommits
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
  }

  return viteSentryPlugin
}
