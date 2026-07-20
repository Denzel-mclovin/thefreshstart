import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

export interface SellerRegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const useSellerAuth = () => {

  const seller = ref(null);
  const loading = ref(false);

  const supabase = useCustomSupabase();
  const authStore = useAuthStore();

//   SELLER REGISTER
  const signUpSeller = async (payload: SellerRegisterPayload) => {
    loading.value = true;

    try {
      const res = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password
      });

      if (res.error) {
        throw new Error(res.error.message);
      }

      if (!res.data.user) {
        throw new Error("User not created");
      }

      await $fetch("/api/seller/register-seller", {
        method: "POST",
        body: {
          authUserId: res.data.user.id,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
        }
      });

      return {
        success: true,
        statusCode: 200,
        data: res.data
      };
    } finally {
      loading.value = false;
    }
  };

// SELLER ENTRANCE

  const signInSeller = async (email: string, password: string) => {
  loading.value = true


  try {
    const res = await supabase.auth.signInWithPassword({ email, password })
    if (res.error) throw new Error(res.error.message)

    const currentSeller = await getCurrentSeller()

    if (!currentSeller) throw new Error('Seller profile not found')

    const roleCookie = useCookie('role', {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    })
    roleCookie.value = 'seller'
    authStore.setRole('seller')
    authStore.setSeller(currentSeller)

    await navigateTo('/seller')

  } finally {
    loading.value = false
  }
}



// CHECK AUTH

  

const getCurrentSeller = async () => {
  const supabase = useCustomSupabase()

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return null

  try {
    return await $fetch('/api/seller/me', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })
  } catch (e) {
    return null
  }

// 
}

const canAccessSellerPanel = async () => {
    const currentSeller = await getCurrentSeller();

    return currentSeller?.approved === "APPROVED";
  };



//   EXIT

const signOutSeller = async () => {
  await supabase.auth.signOut()

  const roleCookie = useCookie('role')
  roleCookie.value = null

  authStore.setRole(null)
  authStore.setSeller(null)
  seller.value = null

  return navigateTo('/seller/login', { replace: true })
}

 const resetPasswordForSeller = async (email: string) => {
    loading.value = true;

    try {
      const res = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/seller/reset-password`,
      });

      if (res.error) {
        throw new Error(res.error.message);
      }

      return {
        success: true,
        statusCode: 200,
      };
    } finally {
      loading.value = false;
    }
  };

  const updateSellerPassword = async (newPassword: string) => {
    loading.value = true;

    try {
      const res = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (res.error) {
        throw new Error(res.error.message);
      }

      return {
        success: true,
        statusCode: 200,
      };
    } finally {
      loading.value = false;
    }
  };

  return {
    seller,
    loading,

    signUpSeller,
    signInSeller,
    signOutSeller,

    getCurrentSeller,
    canAccessSellerPanel,

    resetPasswordForSeller,
    updateSellerPassword,
  };
};