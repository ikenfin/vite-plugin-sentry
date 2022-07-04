import { createFakeCli } from './create-fake-cli'

import { jest } from '@jest/globals'
import { debugLogger } from './debug-logger'



describe('Test create-fake-cli', () => {

  const release = 'test release'

  let mockedLogger: typeof debugLogger
  let cli: ReturnType<typeof createFakeCli>

  beforeEach(() => {
    const mockedSentry = {
      releases: {
        proposeVersion: () => Promise.resolve(release)
      }
    } as ReturnType<typeof createFakeCli>

    mockedLogger = jest.fn((x, y) =>({ x, y }))

    cli = createFakeCli(mockedSentry, mockedLogger)
  })

  it('Test fakeCli has no default implementation', () => {
    expect(() => cli.releases.execute([], false)).toThrow()
    expect(() => cli.releases.listDeploys(release)).toThrow()
    expect(() => cli.execute([], false)).toThrow()
  })

  it('Test cli.releases.proposeVersion', () => {
    expect(cli.releases.proposeVersion()).resolves.toBe(release).then(() => {
      expect(mockedLogger).toBeCalledTimes(1)
      expect(mockedLogger).toBeCalledWith(expect.stringMatching(/Proposed version:\n/), release)
    })
  })

  it('Test promise chain', () => {
    // cli.releases.proposeVersion()
    expect(cli.releases.new(release)).resolves.toBe(release).then(() => {
      expect(mockedLogger).toBeCalledTimes(1)
      expect(mockedLogger).toBeCalledWith(expect.stringMatching(/Creating new release:\n/), release)
    })
  })
})