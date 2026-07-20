export const useUTMTracking = () => {

  const utmStore = useUtmStore()

  const utmCookie = useCookie("utm_data", {
    maxAge: 60 * 60 * 24 * 90
  })

  const saveUTMFromStore = () => {

    if (!utmStore.utmSource && !utmStore.utmContent) return

    utmCookie.value = JSON.stringify({
      utm_source: utmStore.utmSource,
      utm_content: utmStore.utmContent,
      created_at: Date.now()
    })

    utmStore.clearPending()

  }

  return {
    saveUTMFromStore
  }

}