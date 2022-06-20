/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SENTRY_RELEASE: {id?: string}
}

declare module 'virtual:vite-plugin-sentry/sentry-release' {
  export {}
}
