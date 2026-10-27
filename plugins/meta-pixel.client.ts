// plugins/meta-pixel.client.ts

declare global {
  interface Window {
    fbq?: any
    _fbq?: any
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const pixelId = (config.public as any)?.metaPixelId || '1850667959625451'

  // Initialize Meta Pixel script once on client
  if (typeof window !== 'undefined' && !window.fbq) {
    const initPixel = (f: any, b: any, e: string, v: string) => {
      if (f.fbq) return
      const n: any = (f.fbq = function (...args: any[]) {
        if (n.callMethod) {
          n.callMethod.apply(n, args)
        } else {
          n.queue.push(args)
        }
      })
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = true
      n.version = '2.0'
      n.queue = []
      const t = b.createElement(e)
      t.async = true
      t.src = v
      const s = b.getElementsByTagName(e)[0]
      s?.parentNode?.insertBefore(t, s)
    }

    initPixel(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

    window.fbq('init', pixelId)
    window.fbq('track', 'PageView')
  }

  // Track page view on route transitions
  const router = useRouter()
  router.afterEach(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  })
})
