export const useUTM = () => {

  const getUTM = () => {
    const utmCookie = useCookie<string>('utm_data')

    if (utmCookie.value) {
      try {
        const parsed = JSON.parse(utmCookie.value)

        if (parsed?.utm_source || parsed?.utm_content) {
          return {
            utm_source: parsed.utm_source,
            utm_content: parsed.utm_content
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