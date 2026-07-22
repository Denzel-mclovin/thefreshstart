export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  const roleCookie = useCookie<string | null>('role', {
    default: () => null,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30
  })

  const role = roleCookie.value

  // ADMIN ROUTES
  if (to.path.startsWith('/admin')) {
    if (to.path === '/admin/login') return

    if (role !== 'admin') {
      return navigateTo('/admin/login')
    }

    return
  }

  // SELLER ROUTES



  if (!to.path.startsWith('/seller')) return;

    const publicSellerPages = [
      '/seller/login',
      '/seller/reset-password'
    ]



  // allow login page always
  // if (to.path === '/seller/login') {
  //   if (role === 'seller') {
  //     return navigateTo('/seller')
  //   }
  //   return
  // }

  if (publicSellerPages.includes(to.path)) {
    return;
  }

  // AUTH CHECK (COOKIE ONLY — NO SSR CRASH)

  if (!role) {
    return navigateTo('/seller/login')
  }

  if (role !== 'seller') {
    return navigateTo('/seller/login')
  }

  // SELLER APPROVAL FLOW

  const seller = auth.seller

  if (!seller) {
    return
  }

  const approved = seller.approved

  if (approved === 'PENDING') {
    if (to.path !== '/seller/waiting-approval') {
      return navigateTo('/seller/waiting-approval')
    }
    return
  }

  if (approved === 'REJECTED') {
    if (to.path !== '/seller/rejected') {
      return navigateTo('/seller/rejected')
    }
    return
  }

  if (approved === 'APPROVED') {
    if (
      ['/seller/waiting-approval', '/seller/rejected'].includes(to.path)
    ) {
      console.log('SELLER APPROVED', seller)
      auth.setSeller(seller)
      return navigateTo('/seller')
    }
  }
})