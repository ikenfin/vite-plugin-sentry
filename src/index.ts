import type { Plugin } from 'vite'
import type { ViteSentryPluginOptions } from '..'

import { unlink } from 'node:fs/promises'
import path from 'node:path'

import { createSentryCli } from './lib/create-cli'
import { getReleasePromise } from './lib/get-release-promise'

const MODULE_ID = 'virtual:vite-plugin-sentry/sentry-config'
const RESOLVED_ID = '\0' + MODULE_ID

export default function ViteSentry (options: ViteSentryPluginOptions) {
  const {
    skipEnvironmentCheck = false,
    cleanSourcemapsAfterUpload = false,
    legacyErrorHandlingMode = false
  } = options

  const cli = createSentryCli(options)
  const currentReleasePromise = getReleasePromise(cli, options)

  // plugin state
  let pluginState = {
    enabled: false,
    isProduction: false,
    sourcemapsCreated: false,
    baseDir: '',
    sourcemapsFilePaths: new Set<string>()
  }

  const viteSentryPlugin: Plugin = {
    name: 'sentry',
    enforce: 'post',
    apply (config, { command }) {
      // disable plugin in SSR mode
      // TODO: maybe there is better solution to upload generated SSR artifacts too
      if (config.build?.ssr) {
        return false
      }

      return true
    },

    /*
      define SENTRY_RELEASE to `import.meta.env.SENTRY_RELEASE`
    */
    async config () {
      const currentRelease = await currentReleasePromise

      return {
        define: {
          'import.meta.env.VITE_PLUGIN_SENTRY_CONFIG': JSON.stringify({
            dist: options.sourceMaps.dist,
            release: currentRelease
          })
        }
      }
    },

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
      Resolve id for virtual module
    */
    resolveId (id) {
      if (id === MODULE_ID) {
        return RESOLVED_ID
      }
    },

    /*
      Provide virtual module
    */
    load (id) {
      if (id === RESOLVED_ID) {
        return 'globalThis.VITE_PLUGIN_SENTRY_CONFIG = import.meta.env.VITE_PLUGIN_SENTRY_CONFIG\n'
      }
    },

    generateBundle (options, bundle) {
      if (cleanSourcemapsAfterUpload) {
        // set basedir
        pluginState.baseDir = options.dir ?? ''

        for (const file in bundle) {
          if (bundle[file]?.map) {
            pluginState.sourcemapsFilePaths.add(`${file}.map`)
          }
        }
      }
    },

    /*
      We starting plugin here, because at the moment vite completed with building
      so sourcemaps must be ready
    */
    async closeBundle () {
      const { enabled, sourcemapsCreated, isProduction } = pluginState
      const reportSentryError = legacyErrorHandlingMode ? this.warn : this.error

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
        if (!isProduction && skipEnvironmentCheck) {
          this.warn('Running in non-production mode!')
        }

        const currentRelease = await currentReleasePromise

        if (!currentRelease) {
          reportSentryError(
            'Release returned from sentry is empty! Please check your config'
          )
        }
        else {
          try {
            // create release
            await cli.releases.new(currentRelease)

            if (options.cleanArtifacts) {
              await cli.releases.execute(
                [ 'releases', 'files', currentRelease, 'delete', '--all' ],
                true
              )
            }

            // upload source maps
            await cli.releases.uploadSourceMaps(
              currentRelease,
              options.sourceMaps
            )

            // set commits
            if (options.setCommits) {
              const { commit, repo, auto } = options.setCommits

              if (auto || (repo && commit)) {
                await cli.releases.setCommits(
                  currentRelease,
                  options.setCommits
                )
              }
            }

            // finalize release
            if (options.finalize) {
              await cli.releases.finalize(currentRelease)
            }

            // set deploy options
            if (options.deploy && options.deploy.env) {
              await cli.releases.newDeploy(currentRelease, options.deploy)
            }

            if (
              cleanSourcemapsAfterUpload &&
              pluginState.sourcemapsCreated &&
              pluginState.sourcemapsFilePaths.size > 0
            ) {
              for (const file of pluginState.sourcemapsFilePaths) {
                this.warn(`Deleting sourcemap file: ${file}`)
                await unlink(path.join(pluginState.baseDir, file))
              }
            }
          }
          catch (error) {
            reportSentryError(
              `Error while uploading sourcemaps to Sentry: ${error.message}`
            )
          }
        }
      }
    }
  }

  return viteSentryPlugin
}
