/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Config options that can be passed to client from vite config
   */
  readonly VITE_PLUGIN_SENTRY_CONFIG: {
    release?: string
    dist?: string
  }
}

declare module 'virtual:vite-plugin-sentry/sentry-config' {
  export {}
}
