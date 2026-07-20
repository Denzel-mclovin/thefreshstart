<template>
  <div
    class="flex items-center justify-between p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent"
  >
    <h6 class="text-[var(--text-color)] text-xl dark:text-white">
      Subscription plan list
    </h6>
    <button
      class="bg-[var(--text-color)] py-2 px-4 rounded-lg text-white"
      @click="openModal"
    >
      Add new plan
    </button>
  </div>
  <div class="flex-auto px-0 pt-0 pb-2">
    <div class="p-0 overflow-x-auto">
      <table
        class="items-center justify-center w-full mb-0 align-top border-collapse dark:border-white/40 text-slate-500"
      >
        <thead class="align-bottom">
          <tr>
            <th
              class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xs border-b-solid tracking-normal whitespace-nowrap text-slate-400 opacity-70"
            >
              Plan name
            </th>
            <th
              class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xs border-b-solid tracking-normal whitespace-nowrap text-slate-400 opacity-70"
            >
              Amount
            </th>
            <th
              class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xs border-b-solid tracking-normal whitespace-nowrap text-slate-400 opacity-70"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody class="border-t">
          <template v-if="planStore.loading">
            <tr v-for="i in 5" :key="'skeleton-' + i">
              <td
                class="px-6 py-3 align-middle bg-transparent border-b dark:border-white/40"
              >
                <div class="flex items-center">
                  <div class="skeleton w-9 h-9 rounded-xl"></div>
                  <div class="flex flex-col ml-4">
                    <div class="skeleton w-32 h-4 mb-1"></div>
                    <div class="skeleton w-24 h-3"></div>
                  </div>
                </div>
              </td>

              <td
                class="px-6 py-3 align-middle bg-transparent border-b dark:border-white/40"
              >
                <div class="skeleton w-28 h-4 mb-1"></div>
                <div class="skeleton w-20 h-3"></div>
              </td>

              <td
                class="px-6 py-3 text-center align-middle bg-transparent border-b dark:border-white/40"
              >
                <div class="skeleton w-16 h-6 rounded-lg mr-auto"></div>
              </td>

              <td
                class="px-6 py-3 text-center align-middle bg-transparent border-b dark:border-white/40"
              >
                <div class="skeleton w-16 h-3 mx-auto"></div>
              </td>

              <td
                class="px-6 py-3 align-middle bg-transparent border-b dark:border-white/40"
              >
                <div class="skeleton w-12 h-3 mx-auto"></div>
              </td>
            </tr>
          </template>
          <template v-else>
            <div
              class="w-full h-full flex justify-center items-start text-[var(--text-color)] text-lg absolute mt-24"
              v-if="planStore.plans.length === 0"
            >
              There are no subscription plans...
            </div>
            <tr
              v-else
              v-for="(subscriptionPlan, idx) in planStore.plans"
              :key="idx"
            >
              <td
                class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
              >
                <div class="flex px-2">
                  <div></div>
                  <div class="my-auto">
                    <h6
                      class="mb-0 text-lg pl-3 leading-normal dark:text-white"
                    >
                      {{ subscriptionPlan.subName }}
                    </h6>
                  </div>
                </div>
              </td>
              <td
                class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
              >
                <p
                  class="mb-0 text-sm font-semibold leading-normal dark:text-white dark:opacity-60"
                >
                  {{ subscriptionPlan.amount }}
                </p>
              </td>
              <td
                class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
              >
                <span
                  class="text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                >
                  {{ subscriptionPlan.subStatus }}
                </span>
              </td>

              <td
                class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent flex items-center justify-end gap-5"
              >
                <button
                  class="flex items-center justify-center gap-5 text-blue-600 border border-blue-600 border-solid px-5 py-2.5 mb-0 font-bold text-[var(-dark-color)] text-center uppercase align-middle transition-all bg-transparent rounded-lg shadow-none leading-normal text-sm ease-in bg-150 tracking-tight-rem bg-x-25"
                  @click="
                    modalStore.showModal('UpdateCurrentPlan', {
                      planId: subscriptionPlan.id,
                    })
                  "
                >
                  <img
                    src="@/public/img/icons/edit.webp"
                    alt="edit"
                    width="20"
                    height="20"
                  />

                  EDIT
                </button>

                <button
                  class="flex items-center justify-center gap-5 text-rose-600 border border-rose-600 border-solid rounded-lg px-5 py-2.5 mb-0 font-bold text-[var(-dark-color)] text-center uppercase align-middle transition-all bg-transparent shadow-none leading-normal text-sm ease-in bg-150 tracking-tight-rem bg-x-25"
                  @click="
                    modalStore.showModal('DeleteSubscriptionPlan', {
                      planId: subscriptionPlan.id,
                    })
                  "
                >
                  <img
                    src="@/public/img/icons/delete.webp"
                    alt="delete"
                    width="20"
                    height="20"
                  />

                  DELETE
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const modalStore = useModalStore();
const planStore = usePlanStore();

const openModal = () => {
  modalStore.showModal("AddNewPlan", {});
};

onMounted(async () => {
  await planStore.fetchPlans();
});
</script>

<style scoped lang="scss">
.table-header {
  @apply px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b dark:border-white/40 text-xs tracking-normal text-slate-400 opacity-70;
}

.table-cell {
  @apply p-2 align-middle bg-transparent border-b dark:border-white/40 text-slate-400;
}

.skeleton-cell {
  @apply p-2 align-middle bg-transparent border-b dark:border-white/40 flex items-center;
}

.skeleton {
  @apply bg-gray-300 dark:bg-gray-600 animate-pulse;
}
</style>
