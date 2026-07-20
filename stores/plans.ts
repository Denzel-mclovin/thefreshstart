import { defineStore } from "pinia";

export const usePlanStore = defineStore('plan', {

    state: () => ({
        plans: [] as any[],
        loading: false,
        error: null as string | null
    }),

    actions: {
        async fetchPlans() {
            this.loading = true;
            try {
                const getPlanData = await $fetch("/api/subscriptionsPlan", {
                    method: "GET",
                    params: {
                        method: "getAvailablePlans",
                    },
                });

                this.plans = getPlanData.data;
                this.loading = false;
            } catch (error: any) {
                this.error = (error as Error).message;
            } finally {
                this.loading = false;
            }
        },
        async addNewPlan(newPlan: any) {

            console.log(newPlan, 'newPlan in store');

            try {

                const addNewPlan = await $fetch("/api/subscriptionsPlan", {
                    method: "POST",
                    params: {
                        method: "addNewPlan",
                    },
                    body: newPlan
                })

                this.plans.push(addNewPlan.data);
                return addNewPlan.status

            } catch (err) {

                console.error(err)

            }

        },
        async removePlan(id: string) {

            try {

                const sendDelete = await $fetch("/api/subscriptionsPlan", {
                    method: "DELETE",
                    params: {
                        method: "removePlan",
                    },
                    body: {
                        id: id
                    }
                })

                if (sendDelete.statusCode === 200) {
                    this.plans = this.plans.filter((plan: any) => plan.id !== id);
                }

                return sendDelete.statusCode;


            } catch (err) {
                console.log(`Error removing plan: ${err}`)
            }

        },
        async updateCurrentPlan(id: string, data: any) {

            try {

                const updatePlan = await $fetch("/api/subscriptionsPlan", {

                    method: "PATCH",
                    params: {
                        method: "updateCurrentPlan",
                    },
                    body: {
                        id: id,
                        data: data
                    }
                })

                this.plans = this.plans.map((plan: any) => {
                    if (plan.id === id) {
                        return updatePlan.updatePlan;
                    }
                    return plan;
                });

                return updatePlan.statusCode;

            } catch (err) {
                console.log(`Error updating plan: ${err}`)
            }
        }
    }

})