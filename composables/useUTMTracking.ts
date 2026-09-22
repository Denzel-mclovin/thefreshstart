export const useUTMTracking = () => {

  const utmStore = useUtmStore()

  const utmCookie = useCookie<any>("utm_data", {
    maxAge: 60 * 60 * 24 * 90
  })

  const saveUTMFromStore = () => {

    if (!utmStore.utmSource && !utmStore.utmContent && !utmStore.utmMedium && !utmStore.utmCampaign) return

    // First Touch: only save if cookie doesn't have UTMs yet
    const hasExistingUtm = utmCookie.value && (
      utmCookie.value.utm_source || 
      utmCookie.value.utm_content || 
      utmCookie.value.utm_medium || 
      utmCookie.value.utm_campaign
    )

    if (hasExistingUtm) {
      utmStore.clearPending()
      return
    }

    utmCookie.value = {
      utm_source: utmStore.utmSource,
      utm_content: utmStore.utmContent,
      utm_medium: utmStore.utmMedium,
      utm_campaign: utmStore.utmCampaign,
      utm_term: utmStore.utmTerm,
      created_at: Date.now()
    }

    utmStore.clearPending()

  }

  return {
    saveUTMFromStore
  }

}