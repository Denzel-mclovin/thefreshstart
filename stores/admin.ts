import { defineStore } from "pinia";

export const useAdminStore = defineStore('admin', {

    state: () => ({
        hasNewSeller: false,
        activeSellers: [],
        pendingSellers: [],
        archivedSellers: []

    }),
    actions: {
        processData(data: any) {

            this.activeSellers = data
                .filter((s: any) => s.approved?.toUpperCase() === 'APPROVED')
                .map((s: any) => ({
                ...s,
                pendingCount: s.sessions?.filter(
                    (ses: any) => ses.approved?.toUpperCase() === 'PENDING'
                ).length ?? 0,
                }))

            this.pendingSellers = data.filter(
                (s: any) => s.approved?.toUpperCase() === 'PENDING'
            )

            this.archivedSellers = data.filter(
                (s: any) => s.approved?.toUpperCase() === 'REJECTED'
            )

            

        },
        async getActiveSellers() {

            try {

                const fetchSellersList = await $fetch("/api/sellers", {
                    method: "GET",
                    params: {
                        method: "get-sellers-list",
                    },
                });


                this.processData(fetchSellersList.data)
            } catch (err) {

            }
            
        },

        async restoreSeller(id: string) {

            try {

                const restoreSeller = await $fetch("/api/seller/reject", {
                    method: "PATCH",
                    body: {
                        sellerId: id
                    }
                });


                this.processData(restoreSeller)
            } catch (err) {

                console.log("Something went wrong", err);


            }
            
        },
        async setRejectedSellers(id: string) {

            try {

                const rejectSeller = await $fetch("/api/seller/reject", {
                    method: "PATCH",
                    body: {
                        sellerId: id
                    }
                });


                this.processData(rejectSeller)
            } catch (err) {

                console.log("Something went wrong", err);


            }
        },
        async setApprovedSellers(id: string) {

            try {

                const approveSeller = await $fetch("/api/seller/approve", {
                    method: "PATCH",
                    body: {
                        sellerId: id
                    }
                });


                this.processData(approveSeller)
            } catch (err) {

                console.log("Something went wrong", err);


            }

        },
        setHasNewSeller(hasNewSeller: boolean) {
            this.hasNewSeller = hasNewSeller
        },

    }


})