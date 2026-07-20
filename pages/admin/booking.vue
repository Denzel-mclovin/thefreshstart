<template>
  <div class="items-section h-[100vh]">
    <div class="admin-container mx-2 pb-2 flex flex-col">
      <div class="top-block flex justify-between items-center mt-5">
        <div class="page-name">
          <h1 class="mb-0 font-bold text-white">Bookings</h1>
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
                class="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent"
              >
                <h6 class="dark:text-white">Booking list</h6>
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
                          User name
                        </th>
                        <th
                          class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xs border-b-solid tracking-normal whitespace-nowrap text-slate-400 opacity-70"
                        >
                          date/time
                        </th>
                        <th
                          class="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xs border-b-solid tracking-normal whitespace-nowrap text-slate-400 opacity-70"
                        >
                          email
                        </th>
                        <th
                          class="px-6 py-3 pl-2 font-bold text-center uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xs border-b-solid tracking-normal whitespace-nowrap text-slate-400 opacity-70"
                        >
                          Status
                        </th>
                        <th
                          class="px-6 py-3 font-semibold capitalize align-middle bg-transparent border-b border-solid shadow-none dark:border-white/40 dark:text-white tracking-normal whitespace-nowrap"
                        >
                          <!-- Status -->
                        </th>
                      </tr>
                    </thead>
                    <tbody class="border-t">
                      <template v-if="loadingBookingState">
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
                              class="skeleton w-16 h-6 rounded-lg mx-auto"
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
                          v-if="fetchedBookings.length === 0"
                          class="w-full h-full flex justify-center items-start text-[var(--text-color)] text-lg absolute mt-24"
                        >
                          There are no data yet  ...
                        </div>



                        <tr
                          v-else
                          v-for="booking in fetchedBookings"
                          :key="booking.id"
                        >
                          <td
                            class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
                          >
                            <div class="flex px-2">
                              <div></div>
                              <div class="my-auto">
                                <h6
                                  class="mb-0 text-sm leading-normal dark:text-white"
                                >
                                  {{ booking.name }}
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
                                `${booking.dateCallback.slice(0, 10)}, ${
                                  booking.timeSlot
                                }`
                              }}
                            </p>
                          </td>
                          <td
                            class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
                          >
                            <span
                              class="text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                            >
                              {{ booking.email }}
                            </span>
                          </td>
                          <td
                            class="p-2 text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
                          >
                            <div class="flex items-center justify-center">
                              <span
                                class="mr-2 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                              >
                                {{ booking.status }}
                              </span>
                              <div>
                                <div
                                  class="text-xs h-0.75 w-30 m-0 flex overflow-visible rounded-lg bg-gray-200"
                                >
                                  <div
                                    class="flex flex-col justify-center w-3/5 h-auto overflow-hidden text-center text-white transition-all bg-blue-500 rounded duration-600 ease bg-gradient-to-tl from-blue-700 to-cyan-500 whitespace-nowrap"
                                    role="progressbar"
                                    aria-valuenow="60"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td
                            class="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
                          >
                            <button
                              @click="showMoreBtn(booking)"
                              class="inline-block px-5 py-2.5 mb-0 font-bold text-[var(-dark-color)] text-center uppercase align-middle transition-all bg-transparent rounded-lg shadow-none leading-normal text-sm ease-in bg-150 tracking-tight-rem bg-x-25 border border-slate-700"
                            >
                              SHOW MORE
                            </button>
                          </td>
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
import { onMounted, ref, watch, nextTick } from "vue";

import gsap from "gsap";

const modalStore = useModalStore();

const loadingBookingState = ref(false);
const fetchedBookings = ref([]);
const categoryElem = ref(null);
const loadingProductState = ref(false);
const fetchedProducts = ref([]);
const productElem = ref(null);

const activeGroup = ref("products");

const openPopup = (modal) => {
  switch (modal) {
    case "AddProduct":
      break;
    case "AddCategory":
      break;
  }
};

watch(fetchedBookings, async () => {
  console.log("watch fetchedBookings");
  if (categoryElem.value) {
    const prevHeight = categoryElem.value.clientHeight;
    await nextTick();
    const newHeight = categoryElem.value.clientHeight;

    gsap.fromTo(
      categoryElem.value,
      { height: prevHeight },
      { height: newHeight, duration: 0.5, ease: "power2.out" }
    );
  }
});
watch(fetchedProducts, async () => {
  if (productElem.value) {
    const prevHeight = productElem.value.clientHeight;
    await nextTick();
    const newHeight = productElem.value.clientHeight;

    gsap.fromTo(
      productElem.value,
      { height: prevHeight },
      { height: newHeight, duration: 0.5, ease: "power2.out" }
    );
  }
});

definePageMeta({
  layout: "admin",
});

const showGroup = (group) => {
  switch (group) {
    case "products":
      fetchProduct();
      activeGroup.value = "products";
      break;
    case "categories":
      fetchCategory();
      activeGroup.value = "categories";
      break;
  }
};

const showMoreBtn = (bookingInfo) => {
  modalStore.showModal("BookingDetails", {
    id: bookingInfo.id,
    name: bookingInfo.name,
    email: bookingInfo.email,
    phone: bookingInfo.phone,
    comment: bookingInfo.comment,
    contactMethod: bookingInfo.contactMethod,
    timeZone: bookingInfo.timeZone,
    country: bookingInfo.country,
    language: bookingInfo.language,
    dateCallback: bookingInfo.dateCallback,
    timeSlot: bookingInfo.timeSlot,
    createdAt: bookingInfo.createdAt,
    status: bookingInfo.status,
  });
};

const fetchBookings = async () => {
  loadingBookingState.value = true;
  try {
    const getBookings = await $fetch("/api/bookingCall", {
      method: "GET",
      query: { method: "getAllCallbacks" },
    });

    fetchedBookings.value = getBookings.data;

    loadingBookingState.value = false;
  } catch (error) {
    console.log(error.message, "Something went wrong");
  }
};

const fetchProduct = async () => {
  loadingProductState.value = true;

  try {
    const getProducts = await $fetch("/api/products");

    if (getProducts.data.length > 0) {
      fetchedProducts.value = getProducts.data.map((item) => item);
    }

    loadingProductState.value = false;
  } catch (error) {
    console.log(error.message, "Something went wrong");
  }
};

onMounted(() => {
  fetchBookings();
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

.admin-container {
  height: -webkit-fill-available;
}
button {
  color: var(--light-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border: 1px solid white;
  border-radius: 5px;
}
.search-btn {
  border: none;
  border-left: 1px solid var(--dark-color);
  border-radius: unset;
}
.nav {
  ul {
    li {
      padding: 2px 5px;
      border-radius: 5px;
      span {
        cursor: pointer;
        color: var(--dark-color);
      }
    }
    li:hover {
      background: var(--secondary-color);
      span {
        color: var(--bg-color);
      }
    }
    .el-active,
    .el-active:hover {
      background: var(--dark-color);
      cursor: default;
      span {
        color: var(--bg-color);
      }
    }
  }
}
</style>
