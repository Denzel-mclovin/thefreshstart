export const useAnalytics = () => {
  const visitorId = useCookie("visitor_id")
  const sessionId = useCookie("session_id")

  const track = async (type: string, data: any = {}) => {
    await $fetch("/api/analytics/conversion", {
      method: "POST",
      body: {
        visitorId: visitorId.value,
        sessionId: sessionId.value,
        type,
        ...data
      }
    })
  }

  const clickBuy = async () => {
    await track("click_buy")
  }

  const startCheckout = async () => {
    await track("start_checkout")
  }

  return {
    track,
    clickBuy,
    startCheckout
  }
}