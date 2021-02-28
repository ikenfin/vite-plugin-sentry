// rollup.config.js
import pkg from './package.json'
import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'
import commonjs from 'rollup-plugin-commonjs'
import { eslint } from 'rollup-plugin-eslint'
import autoExternal from 'rollup-plugin-auto-external'
import rollupTypescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'es',
      file: pkg.module,
      sourcemap: true
    },
    {
      format: 'cjs',
      file: pkg.main,
      sourcemap: true
    }
  ],
  plugins: [
    eslint(),
    rollupTypescript({
      // typescript
      useTsconfigDeclarationDir: true
    }),
    autoExternal(),
    commonjs(),
    babel(
      babelrc({
        addExternalHelpersPlugin: false
      })
    )
  ]
}
