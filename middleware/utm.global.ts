export default defineNuxtRouteMiddleware(async (to) => {

  if (import.meta.server) return;


  const { initAttribution } = useAttribution()
  initAttribution(to)

  const utmSource = to.query.utm_source as string | undefined
  const utmContent = to.query.utm_content as string | undefined
  const utmMedium = to.query.utm_medium as string | undefined
  const utmCampaign = to.query.utm_campaign as string | undefined
  const utmTerm = to.query.utm_term as string | undefined
  const fbclid = to.query.fbclid as string | undefined

  if (!utmSource && !utmContent && !utmMedium && !utmCampaign && !utmTerm && !fbclid) return;

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

  const fbc = to.query.fbc
  const fbp = to.query.fbp

  const hasUtm = Boolean(
    utmSource || utmContent || utmMedium || utmCampaign || utmTerm
  )

  const hasFacebook = Boolean(fbclid || fbc || fbp)

  if (!hasUtm && !hasFacebook) return

  const cookieConsent = useCookie('cookie_consent')
  const utmCookie = useCookie<any>('utm_data', {
    maxAge: 60 * 60 * 24 * 90
  })
  const facebookCookie = useCookie<any>('facebook_data', {
    maxAge: 60 * 60 * 24 * 90
  })

  const utmStore = useUtmStore()

  if (hasUtm) {
    const utmData = {
      utm_source: utmSource || null,
      utm_content: utmContent || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      utm_term: utmTerm || null
    }

    if (!sessionStorage.getItem('utm_attribution')) {
      sessionStorage.setItem(
        'utm_attribution',
        JSON.stringify(utmData)
      )
    }

    const utmKey = [
      utmSource,
      utmContent,
      utmMedium,
      utmCampaign,
      utmTerm
    ].join('_')

    const trackedKey = `utm_tracked_${utmKey}`

    if (!sessionStorage.getItem(trackedKey)) {
      try {
        await $fetch('/api/utm/update-visit', {
          method: 'POST',
          body: utmData
        })

        sessionStorage.setItem(trackedKey, 'true')
      } catch (error) {
        console.error('UTM tracking error', error)
      }
    }

    const hasExistingUtm = Boolean(
      utmCookie.value?.utm_source ||
      utmCookie.value?.utm_content ||
      utmCookie.value?.utm_medium ||
      utmCookie.value?.utm_campaign ||
      utmCookie.value?.utm_term
    )


    if (cookieConsent.value === 'accepted') {
      if (!hasExistingUtm) {
        utmCookie.value = {
          ...utmData,
          created_at: Date.now()
        }
      }
    } else if (
      !utmStore.utmSource &&
      !utmStore.utmContent &&
      !utmStore.utmMedium &&
      !utmStore.utmCampaign
    ) {
      utmStore.setPending(
        utmSource || '',
        utmContent || '',
        utmMedium || '',
        utmCampaign || '',
        utmTerm || ''
      )
    }
  }

  if (hasFacebook) {
    const facebookData = {
      fbclid: fbclid || null,
      fbc: fbc || (fbclid
        ? `fb.1.${Date.now()}.${fbclid}`
        : null),
      fbp: fbp || null
    }

    if (!sessionStorage.getItem('facebook_attribution')) {
      sessionStorage.setItem(
        'facebook_attribution',
        JSON.stringify(facebookData)
      )
    }
  }

  if (hasFacebook && cookieConsent.value === 'accepted') {
    const hasExistingFacebook = Boolean(
      facebookCookie.value?.fbclid ||
      facebookCookie.value?.fbc ||
      facebookCookie.value?.fbp
    )

    if (!hasExistingFacebook) {
      const fbcValue = fbc || (
        fbclid ? `fb.1.${Date.now()}.${fbclid}` : null
      )

      facebookCookie.value = {
        fbclid: fbclid || null,
        fbc: fbcValue,
        fbp: fbp || null,
        created_at: Date.now()
      }
    }
  }

  const cleanQuery = { ...to.query }

  for (const key of [
    'utm_source',
    'utm_content',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'fbclid',
    'fbc',
    'fbp'
  ]) {
    delete cleanQuery[key]
  }

  return navigateTo(
    {
      path: to.path,
      query: cleanQuery,
      hash: to.hash
    },
    {
      replace: true
    }
  )
})
