<template>
    <nav
      class="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 max-md:mx-3 transition-all ease-in shadow-none duration-250 rounded-2xl lg:flex-nowrap lg:justify-start"
      navbar-main
      navbar-scroll="false"
    >
      <div
        class="flex items-center justify-between w-full pt-10 mx-auto flex-wrap-inherit"
      >

        <nav>
          <h6 class="mb-0 font-bold text-xl text-white capitalize">Generating UTM links</h6>
        </nav>

        <div
          class="flex items-end mt-2 sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto"
        >
          <ul
            class="flex flex-row justify-end pl-0 mb-0 list-none md-max:w-full gap-2"
          >
            <li class="flex items-center xl:hidden">
              <SharedDashBurger />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  <div class="w-full px-6 py-6 max-md:px-1 mx-auto h-full min-h-[100%]">
    <div class="flex flex-wrap -mx-3 w-full h-full max-md:-mx-0">
      <div class="flex-none w-full max-w-full px-3 max-md:px-0">
        <div
          class="relative h-auto flex flex-col min-w-0 mb-6 break-words bg-white dark:bg-[var(--dark-grey)] dark:border dark:border-[var(--dark-border-color)] border-0 border-transparent border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border overflow-hidden"
          ref="productElem"
        >
          <div
            class="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent"
          >
            <h6 class="dark:text-white text-lg font-semibold">Creating UTM link</h6>
          </div>

          <div class="flex-auto p-4">
            <UtmGenerator />
          </div>
        </div>

        <div
          class="relative h-auto flex flex-col min-w-0 mb-6 break-words bg-white dark:bg-[var(--dark-grey)] dark:border dark:border-[var(--dark-border-color)] border-0 border-transparent border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border overflow-hidden"
          ref="productElem"
        >
          <div
            class="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent"
          >
            <h6 class="dark:text-white text-lg font-semibold">Previous links</h6>
          </div>

          <div class="flex-auto p-4">
            <UtmList />
          </div>
        </div>

        
      </div>
    </div>
    
  </div>
</template>

<script setup>



definePageMeta({
  layout: "admin",
});
</script>
