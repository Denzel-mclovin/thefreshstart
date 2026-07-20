
export default defineNuxtPlugin(() => {
  const sessionId = useCookie("session_id")

  const startTime = Date.now()

  window.addEventListener("beforeunload", () => {
    const timeSpent = Date.now() - startTime

    navigator.sendBeacon(
      "/api/analytics/session-end",
      JSON.stringify({
        sessionId: sessionId.value,
        timeSpent
      })
    )
  })
})