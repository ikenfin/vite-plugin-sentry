import type { Plugin } from 'vite'
import type { ViteSentryPluginOptions } from '..'

import { createSentryCli } from './lib/create-cli'
import { getReleasePromise } from './lib/get-release-promise'

export default function ViteSentry (options: ViteSentryPluginOptions) {
  const { skipEnvironmentCheck = false } = options

  const cli = createSentryCli(options)

  // plugin state
  let pluginState = {
    enabled: false,
    sourcemapsCreated: false,
    isProduction: false
  }

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
      pluginState.sourcemapsCreated = !!config.build.sourcemap
      pluginState.isProduction = config.isProduction
      pluginState.enabled =
        pluginState.sourcemapsCreated &&
        (skipEnvironmentCheck || config.isProduction)
    },

    /*
      We starting plugin here, because at the moment vite completed with building
      so sourcemaps must be ready
    */
    async closeBundle () {
      const { enabled, sourcemapsCreated, isProduction } = pluginState

      if (!enabled) {
        if (!isProduction) {
          this.warn(
            'Skipped because running non-production build. If you want to run it anyway set skipEnvironmentCheck option value to true'
          )
        }
        else if (!sourcemapsCreated) {
          this.warn(
            'Skipped because vite is not configured to provide sourcemaps. Please check configuration setting [options.sourcemap]!'
          )
        }
      }
      else {
        if (skipEnvironmentCheck) {
          this.warn('Running in non-production mode!')
        }

        const currentRelease = await getReleasePromise(cli, options)

        if (!currentRelease) {
          this.warn(
            'Release returned from sentry is empty! Please check your config'
          )
        }
        else {
          try {
            // create release
            await cli.releases.new(currentRelease)

            // upload source maps
            await cli.releases.uploadSourceMaps(
              currentRelease,
              options.sourceMaps
            )

            // set commits
            const { commit, repo, auto } = options.setCommits

            if (auto || (repo && commit)) {
              await cli.releases.setCommits(currentRelease, options.setCommits)
            }

            // finalize release
            if (options.finalize) {
              await cli.releases.finalize(currentRelease)
            }

            // set deploy options
            if (options.deploy && options.deploy.env) {
              await cli.releases.newDeploy(currentRelease, options.deploy)
            }
          }
          catch (error) {
            this.warn(
              `Error while uploading sourcemaps to Sentry: ${error.message}`
            )
          }
        }
      }
    }
  }

  return viteSentryPlugin
}
