import { createSentryCli } from './create-cli'
import SentryCli from '@sentry/cli'

describe('Test create-cli', () => {
  it('Test dry-run mode works', () => {
    const fakeCli = createSentryCli({
      dryRun: true
    })

    expect(fakeCli).not.toBeInstanceOf(SentryCli)

    const cli = createSentryCli({
      dryRun: false
    })

    expect(cli).toBeInstanceOf(SentryCli)
  })

  it('Check using defaults', () => {

    const mustBeConfig = {
      silent: false
    }

    const cli = createSentryCli({ dryRun: false })
    expect(cli.options).toMatchObject(mustBeConfig)
  })

  it('Check redeclaring defaults', () => {
    const mustBeConfig = {
      silent: true
    }

    const cli = createSentryCli({ dryRun: false, ...mustBeConfig })
    expect(cli.options).toMatchObject(mustBeConfig)
  })

  it('Check sentry configuration', () => {
    const mustBeConfig = {
      authToken: 'token',
      org: 'org name',
      project: 'project name',
      silent: true,
      url: 'url',
      vcsRemote: 'vcs remote'
    }

    const cli = createSentryCli(mustBeConfig)

    expect(cli.options).toMatchObject(mustBeConfig)
  })

})