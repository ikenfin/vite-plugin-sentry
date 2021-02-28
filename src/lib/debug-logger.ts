import { inspect } from 'util'

export const debugLogger = (label: string, data: any) => {
  if (data) {
    console.log(
      `[Sentry Vite Plugin] ${label} ${inspect(data, false, null, true)}`
    )
  }
  else {
    console.log(`[Sentry Vite Plugin] ${label}`)
  }
}
