<template>
  <div class="items-section h-[100vh]">
    <div class="admin-container mx-2 pb-2 flex flex-col">
      <div class="top-block flex justify-between items-start mt-8 mb-10">
        <div class="page-name">
          <h1 class="mb-0 font-bold text-white">Payments page</h1>
        </div>
        <div class="flex items-center xl:hidden">
          <SharedDashBurger />
        </div>
      </div>

      <div class="w-full px-6 py-6 max-md:px-1 mx-auto h-full min-h-[500px]">
        <div class="flex flex-wrap -mx-3 w-full h-full max-md:-mx-0">
          <div class="flex-none w-full max-w-full px-3 max-md:px-0">
            <div
              class="relative h-full flex flex-col min-w-0 mb-6 break-words bg-white dark:bg-[var(--dark-grey)] dark:border dark:border-[var(--dark-border-color)] border-0 border-transparent border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border overflow-hidden"
              ref="productElem"
            >
              <div
                class="flex items-center justify-between p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent"
              >
                <h6 class="text-[var(--text-color)] text-xl dark:text-white">
                  Payment list
                </h6>
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
                          User
                        </th>
                        <th
                          class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xs border-b-solid tracking-normal whitespace-nowrap text-slate-400 opacity-70"
                        >
                          Email
                        </th>
                        <th
                          class="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xs border-b-solid tracking-normal whitespace-nowrap text-slate-400 opacity-70"
                        >
                          Paid At
                        </th>
                        <th
                          class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xs border-b-solid tracking-normal whitespace-nowrap text-slate-400 opacity-70"
                        >
                          Amount
                        </th>
                        <th
                          class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xs border-b-solid tracking-normal whitespace-nowrap text-slate-400 opacity-70"
                        >
                          Currency
                        </th>
                        <th
                          class="px-6 py-3 pl-2 font-bold text-start uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xs border-b-solid tracking-normal whitespace-nowrap text-slate-400 opacity-70"
                        >
                          Status
                        </th>
                        <th
                          class="px-6 py-3 pl-2 font-bold text-center uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xs border-b-solid tracking-normal whitespace-nowrap text-slate-400 opacity-70"
                        >

                        </th>
                      </tr>
                    </thead>
                    <tbody class="border-t">
                      <template v-if="loading">
                        <tr v-for="i in 5" :key="'skeleton-' + i">
                          <!-- Author -->
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
                          <!-- Function -->
                          <td
                            class="px-6 py-3 align-middle bg-transparent border-b dark:border-white/40"
                          >
                            <div class="skeleton w-28 h-4 mb-1"></div>
                            <div class="skeleton w-20 h-3"></div>
                          </td>
                          <!-- Status -->
                          <td
                            class="px-6 py-3 text-center align-middle bg-transparent border-b dark:border-white/40"
                          >
                            <div
                              class="skeleton w-16 h-6 rounded-lg mr-auto"
                            ></div>
                          </td>
                          <!-- Employed -->
                          <td
                            class="px-6 py-3 text-center align-middle bg-transparent border-b dark:border-white/40"
                          >
                            <div class="skeleton w-16 h-3 mx-auto"></div>
                          </td>
                          <!-- Edit -->
                          <td
                            class="px-6 py-3 align-middle bg-transparent border-b dark:border-white/40"
                          >
                            <div class="skeleton w-12 h-3 mx-auto"></div>
                          </td>
                        </tr>
                      </template>

                      <template v-else>
                        <div
                          v-if="data.length === 0"
                          class="w-full h-full flex justify-center items-start text-[var(--text-color)] text-lg absolute mt-24"
                        >
                          There are no payments ...
                        </div>

                        <tr v-else v-for="(payment, idx) in data" :key="idx">
                          <td
                            class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
                          >
                            <div class="flex px-2">
                              <!-- <div></div> -->
                              <div class="my-auto">
                                <h6
                                  class="mb-0 text-lg pl-3 leading-normal dark:text-white"
                                >
                                  {{
                                    payment.user.name
                                  }}
                                </h6>
                              </div>
                            </div>
                          </td>
                          <td
                            class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
                          >
                            <div class="flex px-2">
                              <!-- <div></div> -->
                              <div class="my-auto">
                                <h6
                                  class="mb-0 text-lg pl-3 leading-normal dark:text-white"
                                >
                                  {{
                                    payment.user.email
                                  }}
                                </h6>
                              </div>
                            </div>
                          </td>
                          <td
                            class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
                          >
                            <div class="flex px-2">
                              <!-- <div></div> -->
                              <div class="my-auto">
                                <h6
                                  class="mb-0 text-lg pl-3 leading-normal dark:text-white"
                                >
                                  {{
                                    `${formatDateTime(
                                      payment.paidAt,
                                      "date"
                                    )}, ${formatDateTime(
                                      payment.paidAt,
                                      "time"
                                    )}`
                                  }}
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
                              {{
                                formatAmount(payment.amount, payment.currency)
                              }}
                            </p>
                          </td>
                          <td
                            class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
                          >
                            <span
                              class="text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                            >
                              {{ payment.currency }}
                            </span>
                          </td>
                          <td
                            class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
                          >
                            <span
                              class="text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                            >
                              {{ payment.status }}
                            </span>
                          </td>
                          <!-- <td
                            class="flex justify-end items-center p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
                          >
                        
                              <button
                                class="flex items-center justify-center gap-2 text-blue-600 border border-blue-600 border-solid px-3 py-1 mb-0 font-bold text-[var(-dark-color)] text-center uppercase align-middle transition-all bg-transparent rounded-lg shadow-none leading-normal text-sm ease-in bg-150 tracking-tight-rem bg-x-25"
                                @click="getPaymentDetails(payment.userId)"
                              >
                                <img
                                  src="@/public/img/icons/edit.webp"
                                  alt="edit"
                                  width="20"
                                  height="20"
                                />

                                EDIT
                              </button>
                          </td> -->
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const activeGroup = ref("subscriptions");
const subscriptionsList = ref("");
const modalStore = useModalStore();

const loading = ref(true);

const data = ref();



const getPaymentDetails = async (userId) => {

  try{

    const fetchUser = await $fetch("/api/users", {
      method: "GET",
      params: {
        method: "get-user",
        userId
      },
      
    })


    console.log(fetchUser, "fetchUser");

  } catch (err ) {
    console.log(err)
  }
}

const formatDateTime = (
  value,
  type
) => {
  // console.log(value, "value", type, "type");
  if (!value) return "";

  const dateObj = new Date(value);

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  if (type === "date") {
    return dateObj.toISOString().split("T")[0];
  }

  if (type === "time") {
    return dateObj.toISOString().split("T")[1].split(".")[0];
  }

  return "";
};

const showGroup = (group) => {
  return "subscriptions";
};

const showList = (list) => {
  return "list";
};

onMounted(async () => {
  const fetchPaymentList = await $fetch("/api/payments", {
    method: "GET",
    params: {
      method: "get-payment-list",
    },
  });



  data.value = fetchPaymentList;

  loading.value = false;
});

definePageMeta({
  layout: "admin",
});
</script>

<style lang="scss">
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
