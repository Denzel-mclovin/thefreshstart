<template>
  <div class="items-section h-[100vh]">
    <div class="admin-container mx-2 pb-2 flex flex-col">
      <div
        class="top-block flex justify-between items-start mt-8 mb-6 max-md:flex-col max-md:items-center max-md:gap-3"
      >
        <div class="page-name">
          <h1 class="mb-0 font-bold text-white">Subscriptions page</h1>
        </div>
        <div class="flex items-start justify-center gap-2 pr-2">
          <div class="flex items-start gap-2 justify-center px-5 flex-col">
            <span
              class="font-semibold leading-tight text-white dark:text-white dark:opacity-60"
            >
              Lists
            </span>
            <div class="nav bg-[#d5ddeb] py-2 px-2 rounded-lg">
              <ul class="flex items center gap-1">
                <li
                  :class="activeGroup === 'subscriptions' ? 'el-active' : ''"
                  class="w-full h-full relative"
                >
                  <button
                    class="w-full h-full relative"
                    @click="showGroup('subscriptions')"
                  >
                    <span
                      class="whitespace-nowrap text-lg max-[375px]:text-[12px]"
                    >
                      Subscriptions
                    </span>
                  </button>
                </li>
                <li
                  :class="
                    activeGroup === 'subscription-plan' ? 'el-active' : ''
                  "
                >
                  <button
                    class="w-full h-full relative"
                    @click="showGroup('subscription-plan')"
                  >
                    <span
                      class="whitespace-nowrap text-lg max-[375px]:text-[12px]"
                      >Subscription plan's
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div class="flex items-center xl:hidden">
            <SharedDashBurger />
          </div>
        </div>
      </div>

      <div class="w-full px-6 py-6 max-md:px-1 mx-auto h-full min-h-[500px]">
        <div class="flex flex-wrap -mx-3 w-full h-full max-md:-mx-0">
          <div class="flex-none w-full max-w-full px-3 max-md:px-0">
            <div
              class="relative h-full flex flex-col min-w-0 mb-6 break-words bg-white dark:bg-[var(--dark-grey)] dark:border dark:border-[var(--dark-border-color)] border-0 border-transparent border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border overflow-hidden"
              ref="productElem"
            >
              <AdminSubscriptionsList v-if="activeGroup === 'subscriptions'" />

              <AdminSubscriptionPlans v-else />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup >
import { ref } from "vue";

const activeGroup = ref("subscriptions");
const subscriptionsList = ref("all-subscriptions");
const subscriptionPlanList = ref("subscription-plan");

const showGroup = (group) => {
  switch (group) {
    case "subscriptions":
      activeGroup.value = "subscriptions";
      break;
    case "subscription-plan":
      activeGroup.value = "subscription-plan";
      break;
  }
};

const showList = (list) => {
  switch (list) {
    case "active-subscriptions":
      subscriptionsList.value = "active-subscriptions";
      break;
    case "canceled-subscriptions":
      subscriptionsList.value = "canceled-subscriptions";
      break;
    case "all-subscriptions":
      subscriptionsList.value = "all-subscriptions";
      break;
  }
};

definePageMeta({
  layout: "admin",
});
</script>

<style lang="scss">
.admin-container {
  height: -webkit-fill-available;
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
      background: var(--text-color);
      cursor: default;
      span {
        color: #fff;
      }
    }
  }
}
</style>
