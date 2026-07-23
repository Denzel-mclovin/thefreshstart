export default defineNuxtPlugin(() => {
  const cookieConsent = useCookie("cookie_consent")

  if (cookieConsent.value === "accepted") return

  const modalStore = useModalStore()

  setTimeout(() => {
    modalStore.showModal("CookieNotification", {})
  }, 3000)
})