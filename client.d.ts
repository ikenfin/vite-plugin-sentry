/// <reference types="vite/client" />

interface ImportMetaEnv {

  /**
   * @deprecated Please, use VITE_PLUGIN_SENTRY_CONFIG instead
   */
  readonly SENTRY_RELEASE: { id?: string }

  /**
   * Config options that can be passed to client from vite config
   */
  readonly VITE_PLUGIN_SENTRY_CONFIG: {
    release?: string
    dist?: string
  }
}

declare module 'virtual:vite-plugin-sentry/sentry-release' {
  export {}
}

declare module 'virtual:vite-plugin-sentry/sentry-config' {
  export {}
}
