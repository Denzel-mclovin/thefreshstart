export default defineNuxtRouteMiddleware(async (to) => {
  const visitorId = useCookie("visitor_id")
  const sessionId = useCookie("session_id")

  const utmSource = to.query.utm_source as string | undefined
  const utmContent = to.query.utm_content as string | undefined

  if (!visitorId.value) {
    visitorId.value = crypto.randomUUID()
  }

  if (!sessionId.value) {
    sessionId.value = crypto.randomUUID()

    await $fetch("/api/analytics/visit", {
      method: "POST",
      body: {
        visitorId: visitorId.value,
        sessionId: sessionId.value,
        utmSource,
        utmContent
      }
    })
  }
})