import type { Plugin } from 'vite'

/*
  Common types
*/
export interface SentryCliOptions {
  silent: boolean
  org: string
  project: string
  authToken: string
  url?: string
  vcsRemote?: string
}

export interface SentryCliUploadSourceMapsOptions {
  include: string | string[]
  ignore?: string[]
  ignoreFile?: string | null
  rewrite?: boolean
  sourceMapReference?: boolean
  stripPrefix?: string[]
  stripCommonPrefix?: boolean
  validate?: boolean
  urlPrefix?: string
  urlSuffix?: string
  ext?: string[]
}

export interface SentryCliNewDeployOptions {
  env: string
  started?: number
  finished?: number
  time?: number
  name?: string
  url?: string
}

export interface SentryCliCommitsOptions {
  auto?: boolean
  repo?: string
  commit?: string
  previousCommit?: string
}

/*
  Typings for untyped sentry cli
*/
declare module '@sentry/cli' {
  export interface SentryCliReleases {
    ['new'](
      release: string,
      options?: { projects: string[] } | string[]
    ): Promise<string>
    setCommits(
      release: string,
      options: SentryCliCommitsOptions
    ): Promise<string>
    finalize(release: string): Promise<string>
    proposeVersion(): Promise<string>
    uploadSourceMaps(
      release: string,
      options: SentryCliUploadSourceMapsOptions
    ): Promise<string>
    newDeploy(
      release: string,
      options: SentryCliNewDeployOptions
    ): Promise<string>
  }

  export interface SentryCliInstance {
    releases: SentryCliReleases
    options: SentryCliOptions
  }

  export default class SentryCli {
    constructor(configPath?: string | null, options?: SentryCliOptions)
    public releases: SentryCliReleases
    public static getVersion(): string
    public static getPath(): string
    public static execute(): Promise<string>
  }
}

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

/*
  Vite plugin function declaration
*/
export default function (options: ViteSentryPluginOptions): Plugin
