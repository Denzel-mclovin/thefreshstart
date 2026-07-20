import { defineStore } from 'pinia';
import { useSellerStore } from './seller';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    role: null as string | null,
    seller: null as any
  }),
  actions: {
    setRole(role: string) {
      this.role = role
    },
    setSeller(seller: any) {
      const sellerStore = useSellerStore()

      this.seller = seller
      sellerStore.setSeller(seller)
    },
    clearRole() {
      
      this.role = null
    },
  }
})