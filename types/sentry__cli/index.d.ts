/*
  Typings for @sentry/cli
*/
declare module '@sentry/cli' {
  export interface SentryCliOptions {
    // temporary fix - @sentry/cli has typo in option key
    vcsRemote?: string
  }
}
