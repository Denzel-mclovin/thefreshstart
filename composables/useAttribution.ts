// export const useAttribution = () => {
//   const utmCookie = useCookie<any>('utm_data')
//   const facebookCookie = useCookie<any>('facebook_data')

//   const getAttribution = () => {
//     const utm = utmCookie.value || {}
//     const facebook = facebookCookie.value || {}

//     const hasUtm = Boolean(
//       utm.utm_source ||
//       utm.utm_medium ||
//       utm.utm_campaign ||
//       utm.utm_content ||
//       utm.utm_term
//     )

//     const hasFacebook = Boolean(
//       facebook.fbclid ||
//       facebook.fbc ||
//       facebook.fbp
//     )

//     return {
//       utm: hasUtm ? {
//         utm_source: utm.utm_source || null,
//         utm_medium: utm.utm_medium || null,
//         utm_campaign: utm.utm_campaign || null,
//         utm_content: utm.utm_content || null,
//         utm_term: utm.utm_term || null
//       } : null,

//       facebook: hasFacebook ? {
//         fbclid: facebook.fbclid || null,
//         fbc: facebook.fbc || null,
//         fbp: facebook.fbp || null
//       } : null
//     }
//   }

//   return {
//     getAttribution
//   }
// }

export const useAttribution = () => {
  const utmCookie = useCookie<any>('utm_data')
  const facebookCookie = useCookie<any>('facebook_data')

  const getStoredData = (key: string) => {
    if (!import.meta.client) return null

    try {
      const value = sessionStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch {
      return null
    }
  }

  const getAttribution = () => {
    const utm = utmCookie.value || getStoredData('utm_attribution') || {}
    const facebook = facebookCookie.value || getStoredData('facebook_attribution') || {}

    const hasUtm = Boolean(
      utm.utm_source ||
      utm.utm_medium ||
      utm.utm_campaign ||
      utm.utm_content ||
      utm.utm_term
    )

    const hasFacebook = Boolean(
      facebook.fbclid ||
      facebook.fbc ||
      facebook.fbp
    )

    return {
      utm: hasUtm
        ? {
            utm_source: utm.utm_source || null,
            utm_medium: utm.utm_medium || null,
            utm_campaign: utm.utm_campaign || null,
            utm_content: utm.utm_content || null,
            utm_term: utm.utm_term || null
          }
        : null,

      facebook: hasFacebook
        ? {
            fbclid: facebook.fbclid || null,
            fbc: facebook.fbc || null,
            fbp: facebook.fbp || null
          }
        : null
    }
  }

  return {
    getAttribution
  }
}