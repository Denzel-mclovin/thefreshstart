import type { RouteLocationNormalized, LocationQueryValue } from 'vue-router'

export interface AttributionData {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  utm_term: string | null
  fbclid: string | null
  fbc: string | null
  fbp: string | null
  referrer: string
  landing_page: string
  ts_first_visit: string
  captured: boolean
}

const COOKIE_NAME = 'attribution_first_touch'
const MAX_AGE_90_DAYS = 60 * 60 * 24 * 90

const first = (v: LocationQueryValue | LocationQueryValue[] | undefined): string | null =>
  (Array.isArray(v) ? v[0] : v) || null

export function useAttribution() {
  const attributionCookie = useCookie<AttributionData>(COOKIE_NAME, {
    maxAge: MAX_AGE_90_DAYS,
    sameSite: 'lax',
    path: '/',
    default: () => ({
      captured: false,
      utm_source: 'direct',
      utm_medium: 'direct',
      utm_campaign: 'direct',
      utm_content: 'direct',
      utm_term: null,
      fbclid: null,
      fbc: null,
      fbp: null,
      referrer: 'direct',
      landing_page: '/',
      ts_first_visit: new Date().toISOString(),
    }),
  })

  const fbcCookie = useCookie<string | null>('_fbc', { maxAge: MAX_AGE_90_DAYS, path: '/' })
  const fbpCookie = useCookie<string | null>('_fbp')

  function initAttribution(route: RouteLocationNormalized): AttributionData {
    if (import.meta.server) return attributionCookie.value
    if (attributionCookie.value?.captured) return attributionCookie.value

    const query = route.query
    const fbclid = first(query.fbclid)

    let fbc = fbcCookie.value || null
    if (!fbc && fbclid) {
      fbc = `fb.1.${Date.now()}.${fbclid}`
      fbcCookie.value = fbc
    }

    const fbp = fbpCookie.value || null

    const rawReferrer = document.referrer?.trim() || ''
    let referrerHostname = 'direct'
    if (rawReferrer) {
      try {
        referrerHostname = new URL(rawReferrer).hostname
      } catch {
        referrerHostname = rawReferrer
      }
    }

    const utmSource = first(query.utm_source) || referrerHostname
    const utmMedium = first(query.utm_medium) || 'direct'
    const utmCampaign = first(query.utm_campaign) || 'direct'
    const utmContent = first(query.utm_content) || 'direct'
    const utmTerm = first(query.utm_term)

    const record: AttributionData = {
      captured: true,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: utmTerm,
      fbclid,
      fbc,
      fbp,
      referrer: rawReferrer || referrerHostname,
      landing_page: route.fullPath,
      ts_first_visit: new Date().toISOString(),
    }

    attributionCookie.value = record

    try {
      if (!sessionStorage.getItem('utm_attribution')) {
        sessionStorage.setItem(
          'utm_attribution',
          JSON.stringify({
            utm_source: utmSource,
            utm_content: utmContent,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            utm_term: utmTerm,
          }),
        )
      }
    } catch {
    }

    return record
  }

  function syncFbp(): string | null {
    if (import.meta.server) return null

    refreshCookie('_fbp')
    const fbp = fbpCookie.value

    if (fbp && attributionCookie.value && !attributionCookie.value.fbp) {
      attributionCookie.value = { ...attributionCookie.value, fbp }
    }
    return fbp || attributionCookie.value?.fbp || null
  }

  return { attribution: attributionCookie, initAttribution, syncFbp }
}