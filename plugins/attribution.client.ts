export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { initAttribution, syncFbp } = useAttribution()

  router.isReady().then(() => {
    initAttribution(router.currentRoute.value)
  })

  setTimeout(() => {
    syncFbp()
  }, 1500)
})