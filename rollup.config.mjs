// rollup.config.js
import { createRequire } from 'node:module'

import commonjs from '@rollup/plugin-commonjs'
import eslint from '@rollup/plugin-eslint'
import typescript from '@rollup/plugin-typescript'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

/**
 * @type { import('rollup').RollupOptions }
 */
export default {
  input: 'src/index.ts',
  external: [ 'util', 'vite', '@sentry/cli', 'node:path', 'node:fs/promises' ],
  output: [
    {
      format: 'es',
      file: pkg.module,
      sourcemap: true,
      exports: 'auto'
    },
    {
      format: 'cjs',
      file: pkg.main,
      sourcemap: true,
      exports: 'auto'
    }
  ],
  plugins: [ eslint(), typescript(), commonjs() ]
}
