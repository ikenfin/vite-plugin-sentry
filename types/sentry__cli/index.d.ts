/*
  Typings for @sentry/cli
*/
declare module '@sentry/cli' {
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

  export default class SentryCli {
    constructor(configPath?: string | null, options?: SentryCliOptions)
    public releases: SentryCliReleases
    public static getVersion(): string
    public static getPath(): string
    public static execute(): Promise<string>
  }
}
