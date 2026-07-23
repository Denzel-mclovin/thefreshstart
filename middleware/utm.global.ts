import { useSessionStorage } from '@vueuse/core'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const utmSource = to.query.utm_source as string | undefined
  const utmContent = to.query.utm_content as string | undefined

  if (!utmSource && !utmContent) return;

  if (process.client) {
  sessionStorage.setItem('utm_attribution', JSON.stringify({
    utm_source: utmSource,
    utm_content: utmContent
  }))
}


  const utmKey = `${utmSource}_${utmContent}`
  const utmTracked = useSessionStorage(`utm_tracked_${utmKey}`, false)

if (!utmTracked.value) {
  try {
    await $fetch('/api/utm/update-visit', {
      method: 'POST',
      body: { utm_source: utmSource, utm_content: utmContent }
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
    utm_content: utmContent
  }

  const isDifferent =
    utmCookie.value?.utm_source !== utmSource ||
    utmCookie.value?.utm_content !== utmContent

  if (cookieConsent.value === "accepted") {
    if (!utmCookie.value || isDifferent) {
      utmCookie.value = {
        ...newUtm,
        updated_at: Date.now()
      }
    }
  } else {
    utmStore.setPending(
      utmSource || "",
      utmContent || ""
    )
  }

  if ("utm_source" in to.query || "utm_content" in to.query) {
    const cleanQuery = { ...to.query }
    delete cleanQuery.utm_source
    delete cleanQuery.utm_content

    return navigateTo({
      path: to.path,
      query: cleanQuery
    }, { replace: true })
  }
})

