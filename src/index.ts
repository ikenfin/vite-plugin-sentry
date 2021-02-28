import { ViteSentryCliOptions } from '../index'
import { createSentryCli, getReleasePromise } from './lib/create-cli'

export default function ViteSentry (options: ViteSentryCliOptions) {
  const cli = createSentryCli(options)
  const release = getReleasePromise(cli, options)

  return {
    name: 'sentry',
    enforce: 'post',
    async buildEnd (error: Error) {
      if (!error) {
        console.log('BuildEnd')
      }
    }
  }
}
