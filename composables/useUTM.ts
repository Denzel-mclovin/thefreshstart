export const useUTM = () => {

  const getUTM = () => {
    const utmCookie = useCookie<string>('utm_data')

    if (utmCookie.value) {
      try {
        const parsed = typeof utmCookie.value === 'string' ? JSON.parse(utmCookie.value) : utmCookie.value

        if (parsed?.utm_source || parsed?.utm_content || parsed?.utm_medium || parsed?.utm_campaign) {
          return {
            utm_source: parsed.utm_source,
            utm_content: parsed.utm_content,
            utm_medium: parsed.utm_medium,
            utm_campaign: parsed.utm_campaign,
            utm_term: parsed.utm_term
          }
        }
      } catch (e) {
        console.error('UTM cookie parse error', e)
      }
    }

    if (process.client) {
      const data = sessionStorage.getItem('utm_attribution')
      if (data) {
        return JSON.parse(data)
      }
    }

    return null
  }

  return { getUTM }
}