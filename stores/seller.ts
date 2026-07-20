import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

interface RequestType {
    statusCode: number,
    message: string,
    data: any
}

export const useSellerStore = defineStore('seller', {
    state: () => ({
        freeLeads: [],
        myLeads: [],
        seller: null,
        loading: false
    }),
    getters: {

    },
    actions: {

        setSeller(seller: any) {
            this.seller = seller
        },

        async getFreeLeads() {
            this.loading = true;
         
            try {

                const leads = await $fetch('/api/seller/free-leads')
                this.freeLeads = leads.leads

            } finally {
                this.loading = false
            }
        },
        async removeMyLead(leadId: string) {

            this.loading = true;

            try {

                const removingLeadReq = await $fetch<RequestType>(`/api/seller/remove-my-lead`, {
                    method: 'PATCH',
                    body: { 
                        sellerId: this.seller.id,
                        leadId
                    }
                })

                if (removingLeadReq.statusCode !== 200) {
                    throw new Error(removingLeadReq.message)
                }

                
                await Promise.all([this.fetchMyLeads(), this.getFreeLeads()]);

                return {
                    statusCode: removingLeadReq.statusCode,
                    message: removingLeadReq.message
                }
            } catch (err) {
                console.log("Something went wrong during removing lead", err);
            } finally {
                this.loading = false;
            }
        },
        async takeFreeLead(leadId: string) {

            this.loading = true;

            try {

                const takingLeadReq = await $fetch<RequestType>(`/api/seller/take-lead`, {
                    method: 'PATCH',
                    body: { 
                        leadId,
                        sellerId: this.seller.id 
                    }
                })

                if (takingLeadReq.statusCode !== 200) {
                    throw new Error(takingLeadReq.message)
                }

                
                await this.getFreeLeads()

                return {
                    statusCode: takingLeadReq.statusCode,
                    message: takingLeadReq.message
                }

            } catch (err) {
                console.log("Something went wrong during taking lead", err);
            } finally {
                this.loading = false;
            }
        },
        async fetchMyLeads() {

            console.log(this.seller, 'SELLER LOG')

            this.loading = true;
            try {
                const fetchLeadsReq = await $fetch<RequestType>('/api/seller/my-leads', {
                    method: 'POST',
                    body: {
                        sellerId: this.seller.id
                    }
                })

                if (fetchLeadsReq.statusCode !== 200) {
                    throw new Error(fetchLeadsReq.message)
                }

                this.myLeads = fetchLeadsReq.data
            } finally {
                this.loading = false
            }
        },
        async getSellerAnalytic() {

            console.log(this.seller, 'SELLER LOG')

            const authStore = useAuthStore();

            console.log(authStore.seller, 'AUTH STORE SELLER LOG')

            this.loading = true;

            try {

                const analytic = await $fetch<RequestType>('/api/seller/seller-analytic', {
                    method: 'POST',
                    body: {
                        sellerId: this.seller.id
                    }
                })

                return analytic;

            } finally {
                this.loading = false    
            }
        }
    },
});