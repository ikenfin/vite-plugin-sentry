# Plugin to integrate Vite ⚡️ with Sentry

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)
[![Twitter: realtominoff](https://img.shields.io/twitter/follow/realtominoff.svg?style=social)](https://twitter.com/realtominoff)

> Vite plugin acts as interface to SentryCLI

It's a port of official [Sentry webpack plugin](https://github.com/getsentry/sentry-webpack-plugin) for Vite.

It's fully written on Typescript and there is some differences in configuration, described below.

## Install

```sh
yarn install
```

## Configuration

If you using Typescript - you can use **ViteSentryPluginOptions** type for better configuration experience with autocomplete.

Example config:

```typescript
// vite.config.ts
// other declarations
import type { ViteSentryPluginOptions } from 'vite-plugin-sentry'
import viteSentry from 'vite-plugin-sentry'

/*
	Configure sentry plugin
*/
const sentryConfig: ViteSentryPluginOptions = {
  url: 'https://my.ondemand.sentry.com',
  authToken: '<SECRET_TOKEN_HERE>',
  org: 'my_org',
  project: 'my_project',
  release: '1.0',
  deploy: {
    env: 'production'
  },
  setCommits: {
    auto: true
  },
  sourceMaps: {
    include: ['./dist/assets'],
    ignore: ['node_modules'],
    urlPrefix: '~/assets'
  }
}

export default defineConfig({
  // other options
  plugins: [ viteSentry(sentryConfig) ]
})
```

Here are the list of all plugin options:

| Option     | Type                             | Required | Default value        | Description                                                  |
| ---------- | -------------------------------- | -------- | -------------------- | ------------------------------------------------------------ |
| debug      | boolean                          | ❌        | false                | Show debug messages during run                               |
| dryRun     | boolean                          | ❌        | false                | Run sentry in dry mode - will only prints all steps          |
| url        | string                           | ❌        | 'https://sentry.io/' | The base URL of your Sentry instance.                        |
| authToken  | string                           | ✅        | ''                   | The authentication token to use for all communication with Sentry. Can be obtained from https://sentry.io/settings/account/api/auth-tokens/. Required scopes: `project:releases` (and `org:read` if `setCommits` option is used). |
| org        | string                           | ✅        | ''                   | The slug of the Sentry organization associated with the app. |
| project    | string                           | ✅        | ''                   | The slug of the Sentry project associated with the app.      |
| vcsRemote  | string                           | ❌        | 'origin'             | The name of the remote in the version control system.        |
| configFile | string                           | ❌        | ''                   | Path to sentry cli config file, as described in https://docs.sentry.io/product/cli/configuration/#configuration-file. By default, the config file is looked for upwards from the current path, and defaults from `~/.sentryclirc` are always loaded |
| release    | string                           | ❌        |                      | Unique name for release. Defaults to sentry-cli releases propose version (requires access to GIT and root directory to be repo) |
| finalize   | boolean                          | ❌        | false                | Determines whether processed release should be automatically finalized after artifacts upload |
| silent     | boolean                          | ❌        | false                | If true, all sentry-cli logs are suppressed                  |
| deploy     | SentryCliNewDeployOptions        |          |                      | Sentry release deployment settings, see details below        |
| sourceMaps | SentryCliUploadSourceMapsOptions |          |                      | Sourcemaps settings, see details below                       |
| setCommits | SentryCliCommitsOptions          |          |                      | Adds commits to sentry, see details below                    |

#### deploy settings

With `deploy` you can configure sentry cli to send deployment info. Here is a table of settings:

| Option   | Type   | Required | Description                                                  |
| -------- | ------ | -------- | ------------------------------------------------------------ |
| env      | string | ✅        | Environment value for release. For example `production`      |
| started  | number | ❌        | UNIX timestamp for deployment start                          |
| finished | number | ❌        | UNIX timestamp for deployment finish                         |
| time     | number | ❌        | Deployment duration in seconds. Can be used instead of `started` and `finished`. |
| name     | string | ❌        | Human-readable name for this deployment                      |
| url      | string | ❌        | URL that points to the deployment                            |

#### sourceMaps settings

With `sourceMaps` you can configure how sourcemaps will be processed

| Option             | Type               | Required | Description                                                  |
| ------------------ | ------------------ | -------- | ------------------------------------------------------------ |
| include            | string \| string[] | ✅        | One or more paths that Sentry CLI should scan recursively for sources. It will upload all `.map` files and match associated `.js` files. |
| ignore             | string[]           | ❌        | Paths to ignore during upload. Overrides entries in `ignoreFile` file. If neither `ignoreFile` nor `ignore` is present, defaults to `['node_modules']`. |
| ignoreFile         | string             | ❌        | Path to a file containing list of files/directories to ignore. Can point to `.gitignore` or anything with the same format. |
| rewrite            | boolean            | ❌        | Enables rewriting of matching source maps so that indexed maps are flattened and missing sources are inlined if possible. Defaults to `true` |
| sourceMapReference | boolean            | ❌        | Prevents the automatic detection of sourcemap references. Defaults to `false`. |
| stripPrefix        | string[]           | ❌        | When paired with `rewrite`, will remove a prefix from uploaded filenames. Useful for removing a path that is build-machine-specific. |
| stripCommonPrefix  | boolean            | ❌        | When paired with `rewrite`, will add `~` to the `stripPrefix` array. Defaults to `false` |
| validate           | boolean            | ❌        | When `true`, attempts source map validation before upload if rewriting is not enabled. It will spot a variety of issues with source maps and cancel the upload if any are found. Defaults to `false` to prevent false positives canceling upload. |
| urlPrefix          | string             | ❌        | URL prefix to add to the beginning of all filenames. Defaults to `~/` but you might want to set this to the full URL. This is also useful if your files are stored in a sub folder. eg: `url-prefix '~/static/js'`. |
| urlSuffix          | string             | ❌        | URL suffix to add to the end of all filenames. Useful for appending query parameters. |
| ext                | string[]           | ❌        | The file extensions to be considered. By default the following file extensions are processed: `js`, `map`, `jsbundle`, and `bundle`. |

#### setCommits settings

With `setCommits` you can configure 

| Option         | Type    | Required             | Description                                                  |
| -------------- | ------- | -------------------- | ------------------------------------------------------------ |
| repo           | string  | ✅`if auto === false` | The full git repo name as defined in Sentry. Required if `auto` option is not `true`, otherwise optional. |
| commit         | string  | ✅`if auto === false` | The current (most recent) commit in the release. Required if `auto` option is not `true`, otherwise optional. |
| previousCommit | string  | ❌                    | The last commit of the previous release. Defaults to the most recent commit of the previous release in Sentry, or if no previous release is found, 10 commits back from `commit`. |
| auto           | boolean | ❌                    | Automatically set `commit` and `previousCommit`. Defaults `commit` to `HEAD` and `previousCommit` as described above. Overrides other options |

## Tests

There are no tests at the moment, because i'm not sure how to test it 😔 If you have ideas - please, make issue or PR. 👍

## Author

👤 **ikenfin**

* Website: https://ikfi.ru
* Twitter: [@realtominoff](https://twitter.com/realtominoff)

## Show your support

Give a ⭐️ if this project helped you!


***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_