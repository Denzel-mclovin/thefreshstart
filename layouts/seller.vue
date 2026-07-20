<template>
  <div
    class="m-0 font-sans text-base antialiased font-normal leading-default bg-gray-50 text-slate-500 dark:bg-[var(--dark-component-color)] dark:text-slate-400"
  >
    <div
      class="absolute w-full bg-[var(--dark-green)] min-h-72"
    ></div>

    <aside
      class="fixed inset-y-0 gap-10 flex flex-col justify-between items-center w-full h-auto p-0 my-4 overflow-y-auto antialiased transition-transform duration-200 -translate-x-full bg-white dark:bg-[var(--dark-grey)] dark:border dark:border-[var(--dark-border-color)] shadow-xl dark:shadow-none dark:bg-slate-850 max-w-64 ease-nav-brand z-990 xl:ml-6 rounded-2xl xl:left-0 xl:translate-x-0 border border-solid border-[var(--text-color)]"
      :aria-expanded="isSidebarOpen"
      :class="{
        '-translate-x-full z-50': !isSidebarOpen,
        'translate-x-4 z-50': isSidebarOpen,
      }"
    >
      <div class="w-full px-2">
        <div class="h-19">
          <div
            class="px-2 py-4 m-0 text-sm whitespace-nowrap text-[var(--dark-green)] flex justify-start items-center gap-2"
            target="_blank"
          >
            <img
              src="../public/logo.webp"
              class="h-auto w-[50px] transition-all duration-200 dark:inline ease-nav-brand bg-[var(--dark-green)] p-1 rounded-lg"
              alt="main_logo"
            />
            <div class="title-wrapper ml-1 flex items-baseline flex-col">
              <span
                class="font-semibold transition-all duration-200 ease-nav-brand"
              >
                Seller dashboard
              </span>
              <span> Thefreshstart </span>
            </div>
          </div>
        </div>
        <hr
          class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent"
        />

        <div
          class="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full py-2"
        >
          <ul class="flex flex-col pl-0 mb-0">
            <li class="mt-0.5 w-full">
              <NuxtLink to="/seller/">
                <div
                  class="py-[0.675rem] bg-blue-500/13 text-sm ease-nav-brand my-0 mx-0 flex items-center whitespace-nowrap rounded-lg px-2 font-semibold text-slate-700 transition-colors"
                  @click="closeSidebar(), (activePage = 'admin')"
                  :class="{
                    'text-white bg-[var(--dark-green)]': activePage === 'seller',
                  }"
                >
                  <div
                    class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-1.5"
                  >
                    <img src="@/public/img/icons/house.png" alt="option" />
                  </div>
                  <span
                    class="ml-1 duration-300 opacity-100 pointer-events-none ease"
                  >
                    Overview
                  </span>
                </div>
              </NuxtLink>
            </li>
            <li class="mt-0.5 w-full">
              <NuxtLink to="/seller/free-leads">
                <div
                  class="py-[0.675rem] bg-blue-500/13 text-sm ease-nav-brand my-0 mx-0 flex items-center whitespace-nowrap rounded-lg px-2 font-semibold text-slate-700 transition-colors"
                  @click="closeSidebar(), (activePage = 'free-leads')"
                  :class="{
                    'text-white bg-[var(--dark-green)]': activePage === 'seller-free-leads',
                  }"
                >
                  <div
                    class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-1.5"
                  >
                    <img src="@/public/img/icons/group.webp" alt="option" />
                  </div>
                  <span
                    class="ml-1 duration-300 opacity-100 pointer-events-none ease"
                  >
                    Free leads
                  </span>
                </div>
              </NuxtLink>
            </li>
            <li class="mt-0.5 w-full">
              <NuxtLink to="/seller/my-leads">
                <div
                  class="py-[0.675rem] bg-blue-500/13 text-sm ease-nav-brand my-0 mx-0 flex items-center whitespace-nowrap rounded-lg px-2 font-semibold text-slate-700 transition-colors"
                  @click="closeSidebar(), (activePage = 'my-leads')"
                  :class="{
                    'text-white bg-[var(--dark-green)]': activePage === 'seller-my-leads',
                  }"
                >
                  <div
                    class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-1.5"
                  >
                    <img src="@/public/img/icons/group.webp" alt="option" />

                  </div>
                  <span
                    class="ml-1 duration-300 opacity-100 pointer-events-none ease"
                  >
                    My leads
                  </span>
                </div>
              </NuxtLink>
            </li>

            <li class="mt-0.5 w-full">
              <NuxtLink to="/seller/analytics">
                <div
                  class="py-[0.675rem] bg-blue-500/13 text-sm ease-nav-brand my-0 mx-0 flex items-center whitespace-nowrap rounded-lg px-2 font-semibold text-slate-700 transition-colors"
                  @click="closeSidebar(), (activePage = 'analytics')"
                  :class="{
                    'text-white bg-[var(--dark-green)]': activePage === 'seller-analytics',
                  }"
                >
                  <div
                    class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-1.5"
                  >
                    <img src="@/public/img/icons/group.webp" alt="option" />

                  </div>
                  <span
                    class="ml-1 duration-300 opacity-100 pointer-events-none ease"
                  >
                    Analytics
                  </span>
                </div>
              </NuxtLink>
            </li>



            <li class="mt-0.5 w-full">
              <!-- <NuxtLink to="/admin/booking">
                <div
                  class="py-[0.675rem] text-sm ease-nav-brand my-0 mx-0 flex items-center whitespace-nowrap px-2 transition-colors rounded-lg font-semibold text-slate-700"
                  @click="closeSidebar(), (activePage = 'admin-booking')"
                  :class="{
                    'text-white bg-[var(--text-color)]':
                      activePage === 'admin-booking',
                  }"
                >
                  <div
                    class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-1.5"
                  >
                    <img src="@/public/img/icons/order.png" alt="option" />
                  </div>
                  <span
                    class="ml-1 duration-300 opacity-100 pointer-events-none ease"
                  >
                    Booking a call's
                  </span>
                </div>
              </NuxtLink> -->

            </li>
          </ul>
        </div>
      </div>

      <div class="px-4 pb-10 w-full">
        <p
          class="invisible hidden text-blue-500 bg-gray-500/30 after:bg-gradient-to-tl after:from-zinc-800 after:to-zinc-700 dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850"
        ></p>
        <div
          class="relative flex flex-col min-w-0 break-words bg-transparent border-0 shadow-none rounded-2xl bg-clip-border"
          sidenav-card
        >

        </div>

        <div
          to="/"
          class="inline-block w-full px-8 py-2 text-xs font-bold border-[1px] leading-normal text-center text-white align-middle transition-all ease-in bg-[#D9485F] rounded-lg shadow-md select-none bg-150 bg-x-25 hover:shadow-xs hover:-translate-y-px hover:bg-transparent hover:border-[#D9485F] hover:text-[#D9485F]"
          @click="logoutHandler"
        >
          Exit
        </div>
      </div>
    </aside>

    <main
      class="relative h-full transition-all duration-200 ease-in-out xl:ml-72 rounded-xl"
    >
      <slot />

      <!-- <Tooltips :props="tooltipProps"/> -->

      <!-- :tooltipProps="tooltipProps"  -->
    </main>

    <!-- <Tooltips v-if="showTooltip" :tooltipStatus="tooltipStatus">
      {{ tooltipMessage }}
    </Tooltips> -->

    <ModalsModal>
      <template #default="{ openModal, closeModal }">
        <component
          :is="currentModal"
          v-bind="modalProps"
          :openModal="openModal"
          :closeModal="closeModal"
        />
      </template>
    </ModalsModal>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

import { useRoute } from "vue-router";

const route = useRoute();

const modalStore = useModalStore();

const currentModal = computed(() => modalStore.currentModal);
const modalProps = computed(() => modalStore.modalProps);
const isSidebarOpen = ref(false);

const burgerBtn = computed(() => modalStore.adminBurgerState);

const activePage = computed(() => route.name);

watch(burgerBtn, () => {
  burgerBtn.value
    ? (isSidebarOpen.value = true)
    : (isSidebarOpen.value = false);
});

const closeSidebar = () => {
  if (isSidebarOpen.value) {
    setTimeout(() => {
      modalStore.setAdminBurgerBtn(false);
      isSidebarOpen.value = false;
    }, 300);
  }
  return;
};

const logoutHandler = async () => {


const { signOutSeller } = useSellerAuth()
  await signOutSeller() 

}



definePageMeta({
  middleware: "admin",
});
</script>

<style lang="scss">

.sd-section {
  padding-inline: 20px;
}
.admin-layout {
  display: flex;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #07110E;

  .sidebar {
    background: var(--dark-color);
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 250px;
    z-index: 100;
  }
  .sidebar-wrapper {
    width: 100%;
    height: 100%;
    position: sticky;
    overflow-y: auto;

    .title-section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1em;
      color: var(--light-color);

      img {
        width: 5vw;
        margin: 1em;
        background: var(--light-color);
        border-radius: 30%;
      }
      h1 {
        font-size: 1.5rem;
      }
      span {
        margin-top: 10px;
        font-size: 0.8rem;
      }
    }
    .list-options {
      position: relative;
      img {
        width: 2vw;
      }
      li {
        position: relative;
        padding: 0.8em 0.7em 0.8em;
        margin-left: 10px;
        margin-right: 5px;
        margin-block: 5px;
        border-radius: 20px;
        cursor: pointer;
        transition: all ease 0.3s;
        color: var(--light-color);
        font-size: 1rem;
        a {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 1em;
        }
        .label {
          background: #ff1744;
          position: absolute;
          transform: translateY(-50%);
          top: 50%;
          right: 2%;
          padding: 2px 5px;
          border-radius: 30%;
          font-weight: 600;
          font-size: 1.1rem;
        }
      }
      li:hover {
        background: rgba(255, 255, 255, 0.1);
        transition: all ease 0.3s;
      }
      li:hover:before {
        content: "";
        position: absolute;
        top: 0;
        left: -3%;
        width: 5px;
        height: 100%;
        background: var(--secondary-color);
        pointer-events: none;
      }
    }
    .exit-btn {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      position: absolute;
      bottom: 0;
      width: -webkit-fill-available;
      gap: 1em;
      padding: 0.8em 0.7em 0.8em;
      margin-left: 10px;
      margin-right: 15px;
      margin-block: 5px;
      border-radius: 20px;
      cursor: pointer;
      transition: all ease 0.3s;
      color: var(--light-color);
      font-size: 1rem;
      img {
        width: 2vw;
      }
    }
    .exit-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      transition: all ease 0.3s;
    }
  }
}
.page-layout {
  background: var(--bg-color);
  height: 100vh;
  margin-left: 250px;
  flex-grow: 1;
  overflow: auto;
}
</style>
