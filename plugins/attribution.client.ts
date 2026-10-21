// plugins/attribution.client.ts
export default defineNuxtPlugin(() => {
  const { initAttribution, syncFbp } = useAttribution()
  
  // Capture immediately on client load
  initAttribution()

  // Attempt to sync _fbp cookie after 1.5s when Meta Pixel script initializes and sets _fbp
  setTimeout(() => {
    syncFbp()
  }, 1500)
})
