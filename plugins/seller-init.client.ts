export default defineNuxtPlugin(async () => {
  const role = useCookie<string | null>('role')
  
  if (role.value !== 'seller') return

  const auth = useAuthStore()
  const supabase = useCustomSupabase()

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return

  try {
    const seller = await $fetch('/api/seller/me', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    if (seller) {
      auth.setSeller(seller)
    }
  } catch (e) {
    console.error('[seller-init] restore failed', e)
  }
})