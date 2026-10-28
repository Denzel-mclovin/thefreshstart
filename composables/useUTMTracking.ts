export const useUTMTracking = () => {
  const utmStore = useUtmStore()

  const utmCookie = useCookie<any>('utm_data', {
    maxAge: 60 * 60 * 24 * 90
  })

  const facebookCookie = useCookie<any>('facebook_data', {
    maxAge: 60 * 60 * 24 * 90
  })

  const saveUTMFromStore = () => {
    if (!import.meta.client) return

    const storedUtm = sessionStorage.getItem('utm_attribution')

    const utmData = storedUtm
      ? JSON.parse(storedUtm)
      : {
          utm_source: utmStore.utmSource,
          utm_content: utmStore.utmContent,
          utm_medium: utmStore.utmMedium,
          utm_campaign: utmStore.utmCampaign,
          utm_term: utmStore.utmTerm
        }

    const hasUtm = Boolean(
      utmData?.utm_source ||
      utmData?.utm_content ||
      utmData?.utm_medium ||
      utmData?.utm_campaign ||
      utmData?.utm_term
    )

    const hasExistingUtm = Boolean(
      utmCookie.value?.utm_source ||
      utmCookie.value?.utm_content ||
      utmCookie.value?.utm_medium ||
      utmCookie.value?.utm_campaign ||
      utmCookie.value?.utm_term
    )

    if (hasUtm && !hasExistingUtm) {
      utmCookie.value = {
        ...utmData,
        created_at: Date.now()
      }
    }

    const storedFacebook = sessionStorage.getItem('facebook_attribution')

    if (storedFacebook) {
      const facebookData = JSON.parse(storedFacebook)

      const hasFacebook = Boolean(
        facebookData?.fbclid ||
        facebookData?.fbc ||
        facebookData?.fbp
      )

      const hasExistingFacebook = Boolean(
        facebookCookie.value?.fbclid ||
        facebookCookie.value?.fbc ||
        facebookCookie.value?.fbp
      )

      if (hasFacebook && !hasExistingFacebook) {
        facebookCookie.value = {
          ...facebookData,
          created_at: Date.now()
        }
      }
    }

    utmStore.clearPending()
  }

  return {
    saveUTMFromStore
  }
}