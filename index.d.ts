import type { Plugin } from 'vite'

///<reference path="@types/sentry__cli/index.d.ts" />
import type {
  SentryCliCommitsOptions,
  SentryCliNewDeployOptions,
  SentryCliUploadSourceMapsOptions
} from '@sentry/cli'

/*
  Plugin input options
*/
export interface ViteSentryPluginOptions {

  /*
    Show debug messages during run
  */
  debug?: boolean

  /*
    Dry run mode
  */
  dryRun?: boolean

  /*
    Sentry required arguments
  */

  /*
    Url of sentry installation
  */
  url?: string

  /*
    Authentication token for API
  */
  authToken: string

  /*
    Organisation slut
  */
  org: string

  /*
    Project slug
  */
  project: string

  /*
    VCS remote name
  */
  vcsRemote?: string

  /*
    Path to sentry cli config file
  */
  configFile?: string

  /*
    Unique name for release
    defaults to sentry-cli releases propose version (requires access to GIT and root directory to be repo)
  */
  release?: string

  /*
    Determines whether processed release should be automatically finalized after artifacts upload
  */
  finalize?: boolean

  /*
    If true, all sentry-cli logs are suppressed
  */
  silent?: boolean

  /*
    Deployment settings
  */
  deploy: SentryCliNewDeployOptions

  /*
    Source maps settings
  */
  sourceMaps: SentryCliUploadSourceMapsOptions

  /*
    Commits seettings
  */
  setCommits: SentryCliCommitsOptions
}

export default function (options: ViteSentryPluginOptions): Plugin
