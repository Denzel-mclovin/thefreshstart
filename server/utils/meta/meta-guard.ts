export function isProdUrl(urlStr?: string | null): boolean {
  if (!urlStr) return false
  try {
    const parsed = new URL(urlStr)
    if (parsed.protocol !== 'https:') return false
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase()
    return host === 'thefreshstart.net'
  } catch {
    return false
  }
}

export function isProductionTrackingAllowed(
  eventSourceUrl?: string,
  requestOrigin?: string,
  requestReferer?: string
): boolean {
  const config = useRuntimeConfig()

  // 1. Explicitly disabled
  if (config.metaCapiEnabled === false) {
    return false
  }

  // 2. If running on Vercel, must be production deployment
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return false
  }

  // 3. eventSourceUrl MUST strictly be https://thefreshstart.net or https://www.thefreshstart.net
  if (!isProdUrl(eventSourceUrl)) {
    return false
  }

  // 4. If request origin header is provided, it must strictly be the production URL
  if (requestOrigin && !isProdUrl(requestOrigin)) {
    return false
  }

  // 5. If request referer header is provided, it must strictly be the production URL
  if (requestReferer && !isProdUrl(requestReferer)) {
    return false
  }

  return true
}