import { useSessionStorage } from '@vueuse/core'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const utmSource = to.query.utm_source as string | undefined
  const utmContent = to.query.utm_content as string | undefined
  const utmMedium = to.query.utm_medium as string | undefined
  const utmCampaign = to.query.utm_campaign as string | undefined
  const utmTerm = to.query.utm_term as string | undefined

  if (!utmSource && !utmContent && !utmMedium && !utmCampaign && !utmTerm) return;

  if (process.client) {
    const existing = sessionStorage.getItem('utm_attribution')
    if (!existing) {
      sessionStorage.setItem('utm_attribution', JSON.stringify({
        utm_source: utmSource,
        utm_content: utmContent,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_term: utmTerm
      }))
    }
  }

  const utmKey = `${utmSource}_${utmContent}_${utmMedium}_${utmCampaign}_${utmTerm}`
  const utmTracked = useSessionStorage(`utm_tracked_${utmKey}`, false)

if (!utmTracked.value) {
    try {
      await $fetch('/api/utm/update-visit', {
        method: 'POST',
        body: { 
          utm_source: utmSource, 
          utm_content: utmContent,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_term: utmTerm
        }
      })

      utmTracked.value = true
  } catch (e) {
    console.error('UTM tracking error', e)
  }
}

  const utmStore = useUtmStore()
  const utmCookie = useCookie<any>("utm_data", { maxAge: 60 * 60 * 24 * 90 })
  const cookieConsent = useCookie('cookie_consent')

  const newUtm = {
    utm_source: utmSource,
    utm_content: utmContent,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_term: utmTerm
  }

  // First Touch Rule: check if a UTM cookie already exists and has values
  const hasExistingUtm = utmCookie.value && (
    utmCookie.value.utm_source || 
    utmCookie.value.utm_content || 
    utmCookie.value.utm_medium || 
    utmCookie.value.utm_campaign
  )

  if (cookieConsent.value === "accepted") {
    if (!hasExistingUtm) {
      utmCookie.value = {
        ...newUtm,
        updated_at: Date.now()
      }
    }
  } else {
    // If not accepted yet, we still shouldn't override if there's already pending UTMs
    if (!utmStore.utmSource && !utmStore.utmMedium && !utmStore.utmCampaign) {
      utmStore.setPending(
        utmSource || "",
        utmContent || "",
        utmMedium || "",
        utmCampaign || "",
        utmTerm || ""
      )
    }
  }

  if ("utm_source" in to.query || "utm_content" in to.query || "utm_medium" in to.query || "utm_campaign" in to.query || "utm_term" in to.query) {
    const cleanQuery = { ...to.query }
    delete cleanQuery.utm_source
    delete cleanQuery.utm_content
    delete cleanQuery.utm_medium
    delete cleanQuery.utm_campaign
    delete cleanQuery.utm_term

    return navigateTo({
      path: to.path,
      query: cleanQuery
    }, { replace: true })
  }
})

