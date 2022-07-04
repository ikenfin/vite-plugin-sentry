import { getReleasePromise } from './get-release-promise'
import { createSentryCli } from './create-cli'

import { randomUUID } from 'crypto'

// Helpers:
const mockSentryCli = (version = randomUUID()) => ({
  version,
  cli: {
    releases: {
      proposeVersion: async () => version
    }
  }
})

// Test:
describe('Tests for getReleasePromise', () => {
  let cli: ReturnType<typeof createSentryCli>

  beforeEach(() => {
    cli = createSentryCli({
      dryRun: true
    })
  })


  it('Call getReleasePromise without options uses proposed by sentry', () => {
    const { cli, version } = mockSentryCli()
    const releasePromise = getReleasePromise(cli as any)
    expect(releasePromise).resolves.toBe(version)
  })

  it('Check getReleasePromise uses proposeVersion method', () => {
    const { cli, version } = mockSentryCli()
    const releasePromise = getReleasePromise(cli as any, {})
    expect(releasePromise).resolves.toBe(version)
  })

  it('Check options.release is preferrable than sentrycli method call', () => {
    const release = 'proposed release'
    const { cli } = mockSentryCli()
    const releasePromise = getReleasePromise(cli as any, { release })
    expect(releasePromise).resolves.toBe(release)
  })

  it('Check getReleasePromise trims release result', () => {
    const release = '    my release      '
    const releasePromise = getReleasePromise(cli, {
      release
    })
    expect(releasePromise).resolves.toBe(release.trim())
  })

  it('Check getReleasePromise returns undefined if proposeVersion rejects', () => {
    const release = 'proposed release'

    const mockCli = {
      releases: {
        proposeVersion:  () => Promise.reject(release)
      }
    }

    const releasePromise = getReleasePromise(mockCli as any, {})

    expect(releasePromise).resolves.toBeUndefined()
  })
})