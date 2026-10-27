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
const MAX_AGE_90_DAYS = 60 * 60 * 24 * 90 // 90 days in seconds

export function useAttribution() {
  const route = useRoute()

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
      ts_first_visit: new Date().toISOString()
    })
  })

  /**
   * Captures attribution once on first visit (First touch wins, never overwritten).
   * Generates or formats fbc from fbclid, captures _fbp cookie, and enforces fallbacks.
   */
  function initAttribution(): AttributionData {
    if (import.meta.server) {
      return attributionCookie.value
    }

    // First touch wins - if already captured, never overwrite
    if (attributionCookie.value && attributionCookie.value.captured) {
      return attributionCookie.value
    }

    const query = route.query
    const fbclid = (query.fbclid as string) || null

    // Meta Click ID (fbc) logic:
    // Format: fb.1.<creation_time>.<fbclid>
    const existingFbcCookie = useCookie<string | null>('_fbc').value
    let fbc = existingFbcCookie || null
    if (!fbc && fbclid) {
      fbc = `fb.1.${Date.now()}.${fbclid}`
      // Persist _fbc cookie so standard pixel and other scripts can read it too
      const fbcCookie = useCookie('_fbc', { maxAge: MAX_AGE_90_DAYS, path: '/' })
      fbcCookie.value = fbc
    }

    // Meta Browser Cookie (_fbp)
    const fbp = useCookie<string | null>('_fbp').value || null

    // Referrer
    const rawReferrer = document.referrer ? document.referrer.trim() : ''
    let referrerHostname = 'direct'
    if (rawReferrer) {
      try {
        referrerHostname = new URL(rawReferrer).hostname
      } catch {
        referrerHostname = rawReferrer
      }
    }

    // Fallbacks per spec: if no parameters, set utm_source to direct and store referrer
    const utmSource = (query.utm_source as string) || (referrerHostname !== 'direct' ? referrerHostname : 'direct')
    const utmMedium = (query.utm_medium as string) || 'direct'
    const utmCampaign = (query.utm_campaign as string) || 'direct'
    const utmContent = (query.utm_content as string) || 'direct'
    const utmTerm = (query.utm_term as string) || null

    const landingPage = window.location.pathname + window.location.search

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
      landing_page: landingPage,
      ts_first_visit: new Date().toISOString()
    }

    attributionCookie.value = record

    // Also sync to legacy sessionStorage for backward compatibility with existing components
    try {
      if (!sessionStorage.getItem('utm_attribution')) {
        sessionStorage.setItem('utm_attribution', JSON.stringify({
          utm_source: utmSource,
          utm_content: utmContent,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_term: utmTerm
        }))
      }
    } catch (e) {
      // Ignore sessionStorage errors
    }

    return record
  }

  /**
   * Helper to refresh _fbp if it was set by the Meta Pixel script after initial page load
   */
  function syncFbp(): string | null {
    if (import.meta.server) return null
    const fbpFromCookie = useCookie<string | null>('_fbp').value
    if (fbpFromCookie && attributionCookie.value && !attributionCookie.value.fbp) {
      attributionCookie.value.fbp = fbpFromCookie
    }
    return fbpFromCookie || attributionCookie.value?.fbp || null
  }

  return {
    attribution: attributionCookie,
    initAttribution,
    syncFbp
  }
}
