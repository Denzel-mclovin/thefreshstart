export function isProductionTrackingAllowed(
  eventSourceUrl?: string
): boolean {
  const config = useRuntimeConfig()

  if (
    !config.metaCapiEnabled ||
    process.env.VERCEL_ENV !== 'production'
  ) {
    return false
  }

  if (!eventSourceUrl) return false

  try {
    const eventUrl = new URL(eventSourceUrl)
    const productionUrl = new URL((config.public as any)?.siteUrl)

    return (
      eventUrl.protocol === 'https:' &&
      eventUrl.hostname === productionUrl.hostname
    )
  } catch {
    return false
  }
}