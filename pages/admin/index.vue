<template>
  <div>
    <nav
      class="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 max-md:mx-3 transition-all ease-in shadow-none duration-250 rounded-2xl lg:flex-nowrap lg:justify-start"
      navbar-main
      navbar-scroll="false"
    >
      <div
        class="flex items-center justify-between w-full pt-10 mx-auto flex-wrap-inherit"
      >
        <!-- breadcrumb -->

        <nav>
          <!-- <ol class="flex flex-wrap pt-1 mr-12 bg-transparent rounded-lg sm:mr-16">
              <li class="text-sm leading-normal">
                <a class="text-white opacity-50" href="javascript:;">Pages</a>
              </li>
              <li class="text-sm pl-2 capitalize leading-normal text-white before:float-left before:pr-2 before:text-white before:content-['/']" aria-current="page">Dashboard</li>
            </ol> -->
          <h6 class="mb-0 font-bold text-white capitalize">Dashboard</h6>
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

    <!-- end Navbar -->

    <!-- cards -->
    <div class="w-full px-6 py-6 mx-auto max-md:px-3">
      <!-- row 1 -->
      <div class="flex flex-wrap -mx-3 items-stretch">
        <!-- card1 -->
        <div
          class="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4 relative"
        >
          <div
            class="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl dark:bg-gray-950 dark:border dark:border-solid dark:border-[var(--dark-border-color)] dark:shadow-dark-xl rounded-2xl bg-clip-border"
          >
            <div class="flex-auto p-4">
              <div class="flex flex-row -mx-3">
                <div class="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <p
                      class="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60"
                    >
                      All earnings
                    </p>
                    <h5 class="mb-2 font-bold dark:text-white">0 $</h5>
                    <p class="mb-0 dark:text-white dark:opacity-60">
                      <span
                        class="text-sm font-bold leading-normal text-emerald-500"
                        >+0%</span
                      >
                      since last month
                    </p>
                  </div>
                </div>
                <div class="px-3 text-right basis-1/3">
                  <div
                    class="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500"
                  >
                    <i
                      class="ni leading-none ni-money-coins text-lg relative top-3.5 text-white"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- card2 -->
        <div
          class="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4"
        >
          <div
            class="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl dark:bg-gray-950 dark:border dark:border-solid dark:border-[var(--dark-border-color)] dark:shadow-dark-xl rounded-2xl bg-clip-border"
          >
            <div class="flex-auto p-4">
              <div class="flex flex-row -mx-3">
                <div class="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <p
                      class="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60"
                    >
                      Users
                    </p>
                    <h5 class="mb-2 font-bold dark:text-white">0</h5>
                    <p class="mb-0 dark:text-white dark:opacity-60">
                      <span
                        class="text-sm font-bold leading-normal text-emerald-500"
                        >+3%</span
                      >
                      since last week
                    </p>
                  </div>
                </div>
                <div class="px-3 text-right basis-1/3">
                  <div
                    class="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-red-600 to-orange-600"
                  >
                    <i
                      class="ni leading-none ni-world text-lg relative top-3.5 text-white"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- card3 -->
        <div
          class="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4"
        >
          <div
            class="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl dark:bg-gray-950 dark:border dark:border-solid dark:border-[var(--dark-border-color)] dark:shadow-dark-xl rounded-2xl bg-clip-border"
          >
            <div class="flex-auto p-4">
              <div class="flex flex-row -mx-3">
                <div class="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <p
                      class="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60"
                    >
                      Bookings
                    </p>
                    <h5 class="mb-2 font-bold dark:text-white">0</h5>
                    <p class="mb-0 dark:text-white dark:opacity-60">
                      <span
                        class="text-sm font-bold leading-normal text-red-600"
                        >-0%</span
                      >
                      since last month
                    </p>
                  </div>
                </div>
                <div class="px-3 text-right basis-1/3">
                  <div
                    class="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-emerald-500 to-teal-400"
                  >
                    <i
                      class="ni leading-none ni-paper-diploma text-lg relative top-3.5 text-white"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- card4 -->
        <div class="w-full max-w-full px-3 sm:w-1/2 sm:flex-none xl:w-1/4">
          <div
            class="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl dark:bg-gray-950 dark:border dark:border-solid dark:border-[var(--dark-border-color)] dark:shadow-dark-xl rounded-2xl bg-clip-border"
          >
            <div class="flex-auto p-4">
              <div class="flex flex-row -mx-3">
                <div class="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <p
                      class="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60"
                    >
                      Sales
                    </p>
                    <h5 class="mb-2 font-bold dark:text-white">0 $.</h5>
                    <p class="mb-0 dark:text-white dark:opacity-60">
                      <span
                        class="text-sm font-bold leading-normal text-emerald-500"
                        >+0%</span
                      >
                      since last month
                    </p>
                  </div>
                </div>
                <div class="px-3 text-right basis-1/3">
                  <div
                    class="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-orange-500 to-yellow-500"
                  >
                    <i
                      class="ni leading-none ni-cart text-lg relative top-3.5 text-white"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- cards row 2 -->
      <div class="flex flex-wrap mt-6 -mx-3">
        <SalesChart />
      </div>

      <!-- cards row 3 -->

      <div class="flex flex-wrap mt-6 -mx-3">
        <div
          class="w-full max-w-full px-3 mt-0 mb-6 lg:mb-0 lg:w-7/12 lg:flex-none"
        >
          <div
            class="relative flex flex-col min-w-0 break-words bg-white border-0 dark:border dark:border-[var(--dark-border-color)] border-solid shadow-xl dark:shadow-dark-xl dark:bg-gray-950 border-black-125 rounded-2xl bg-clip-border"
          >
            <div class="p-4 pb-0 mb-0 rounded-t-4">
              <div class="flex justify-between">
                <h6 class="mb-2 dark:text-white">Recent orders</h6>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table
                class="items-center w-full mb-4 align-top border-collapse border-gray-200 dark:border-white/40"
              >
                <tbody>
                  <tr>
                    <td
                      class="p-2 align-middle bg-transparent border-b w-3/10 whitespace-nowrap dark:border-white/40"
                    >
                      <div class="flex items-center px-2 py-1">
                        <div></div>
                        <div class="ml-6">
                          <p
                            class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                          >
                            Client:
                          </p>
                          <h6
                            class="mb-0 text-sm leading-normal dark:text-white"
                          >
                            J. Larse
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td
                      class="p-2 align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Ammount:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          0 $
                        </h6>
                      </div>
                    </td>
                    <td
                      class="p-2 align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Destination ciy:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          Cydney
                        </h6>
                      </div>
                    </td>
                    <td
                      class="p-2 text-sm leading-normal align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="flex-1 text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Delivery method:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          Express delivery
                        </h6>
                      </div>
                    </td>
                    <td
                      class="p-2 text-sm leading-normal align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="flex-1 text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Status:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          New
                        </h6>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="p-2 align-middle bg-transparent border-b w-3/10 whitespace-nowrap dark:border-white/40"
                    >
                      <div class="flex items-center px-2 py-1">
                        <div>
                          <!-- <img src="./assets/img/icons/flags/US.png" alt="Country flag" /> -->
                        </div>
                        <div class="ml-6">
                          <p
                            class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                          >
                            Client:
                          </p>
                          <h6
                            class="mb-0 text-sm leading-normal dark:text-white"
                          >
                            J. Larse
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td
                      class="p-2 align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Ammount:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          0 $
                        </h6>
                      </div>
                    </td>
                    <td
                      class="p-2 align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Destination ciy:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          Cydney
                        </h6>
                      </div>
                    </td>
                    <td
                      class="p-2 text-sm leading-normal align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="flex-1 text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Delivery method:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          Express delivery
                        </h6>
                      </div>
                    </td>
                    <td
                      class="p-2 text-sm leading-normal align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="flex-1 text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Status:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          New
                        </h6>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="p-2 align-middle bg-transparent border-b w-3/10 whitespace-nowrap dark:border-white/40"
                    >
                      <div class="flex items-center px-2 py-1">
                        <div>
                          <!-- <img src="./assets/img/icons/flags/US.png" alt="Country flag" /> -->
                        </div>
                        <div class="ml-6">
                          <p
                            class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                          >
                            Client:
                          </p>
                          <h6
                            class="mb-0 text-sm leading-normal dark:text-white"
                          >
                            J. Larse
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td
                      class="p-2 align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Ammount:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          0 $
                        </h6>
                      </div>
                    </td>
                    <td
                      class="p-2 align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Destination ciy:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          Cydney
                        </h6>
                      </div>
                    </td>
                    <td
                      class="p-2 text-sm leading-normal align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="flex-1 text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Delivery method:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          Express delivery
                        </h6>
                      </div>
                    </td>
                    <td
                      class="p-2 text-sm leading-normal align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="flex-1 text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Status:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          New
                        </h6>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="p-2 align-middle bg-transparent border-b w-3/10 whitespace-nowrap dark:border-white/40"
                    >
                      <div class="flex items-center px-2 py-1">
                        <div>
                          <!-- <img src="./assets/img/icons/flags/US.png" alt="Country flag" /> -->
                        </div>
                        <div class="ml-6">
                          <p
                            class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                          >
                            Client:
                          </p>
                          <h6
                            class="mb-0 text-sm leading-normal dark:text-white"
                          >
                            J. Larse
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td
                      class="p-2 align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Ammount:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          0 $
                        </h6>
                      </div>
                    </td>
                    <td
                      class="p-2 align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Destination ciy:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          Cydney
                        </h6>
                      </div>
                    </td>
                    <td
                      class="p-2 text-sm leading-normal align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="flex-1 text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Delivery method:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          Express delivery
                        </h6>
                      </div>
                    </td>
                    <td
                      class="p-2 text-sm leading-normal align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40"
                    >
                      <div class="flex-1 text-center">
                        <p
                          class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60"
                        >
                          Status:
                        </p>
                        <h6 class="mb-0 text-sm leading-normal dark:text-white">
                          New
                        </h6>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="w-full max-w-full px-3 mt-0 lg:w-5/12 lg:flex-none">
          <div
            class="border-black/12.5 shadow-xl dark:bg-gray-950 dark:border-[var(--dark-border-color)] dark:shadow-dark-xl relative flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border"
          >
            <div class="p-4 pb-0 rounded-t-4">
              <h6 class="mb-0 dark:text-white">Product category</h6>
            </div>
            <div class="flex-auto p-4">
              <ul class="flex flex-col pl-0 mb-0 rounded-lg">
                <li
                  class="relative flex justify-between py-2 pr-4 mb-2 border-0 rounded-t-lg rounded-xl text-inherit"
                >
                  <div class="flex items-center">
                    <div
                      class="inline-block w-8 h-8 mr-4 text-center text-black bg-center shadow-sm fill-current stroke-none bg-gradient-to-tl from-zinc-800 to-zinc-700 dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 rounded-xl"
                    >
                      <i
                        class="text-white ni ni-mobile-button relative top-0.75 text-xxs"
                      ></i>
                    </div>
                    <div class="flex flex-col">
                      <h6
                        class="mb-1 text-sm leading-normal text-slate-700 dark:text-white"
                      >
                        Devices
                      </h6>
                      <span class="text-xs leading-tight dark:text-white/80"
                        >250 in stock,
                        <span class="font-semibold">346+ sold</span></span
                      >
                    </div>
                  </div>
                  <div class="flex">
                    <button
                      class="group ease-in leading-pro text-xs rounded-3.5xl p-1.2 h-6.5 w-6.5 mx-0 my-auto inline-block cursor-pointer border-0 bg-transparent text-center align-middle font-bold text-slate-700 shadow-none transition-all dark:text-white"
                    >
                      <i
                        class="ni ease-bounce text-2xs group-hover:translate-x-1.25 ni-bold-right transition-all duration-200"
                        aria-hidden="true"
                      ></i>
                    </button>
                  </div>
                </li>
                <li
                  class="relative flex justify-between py-2 pr-4 mb-2 border-0 rounded-xl text-inherit"
                >
                  <div class="flex items-center">
                    <div
                      class="inline-block w-8 h-8 mr-4 text-center text-black bg-center shadow-sm fill-current stroke-none bg-gradient-to-tl from-zinc-800 to-zinc-700 dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 rounded-xl"
                    >
                      <i
                        class="text-white ni ni-tag relative top-0.75 text-xxs"
                      ></i>
                    </div>
                    <div class="flex flex-col">
                      <h6
                        class="mb-1 text-sm leading-normal text-slate-700 dark:text-white"
                      >
                        Tickets
                      </h6>
                      <span class="text-xs leading-tight dark:text-white/80"
                        >123 closed,
                        <span class="font-semibold">15 open</span></span
                      >
                    </div>
                  </div>
                  <div class="flex">
                    <button
                      class="group ease-in leading-pro text-xs rounded-3.5xl p-1.2 h-6.5 w-6.5 mx-0 my-auto inline-block cursor-pointer border-0 bg-transparent text-center align-middle font-bold text-slate-700 shadow-none transition-all dark:text-white"
                    >
                      <i
                        class="ni ease-bounce text-2xs group-hover:translate-x-1.25 ni-bold-right transition-all duration-200"
                        aria-hidden="true"
                      ></i>
                    </button>
                  </div>
                </li>
                <li
                  class="relative flex justify-between py-2 pr-4 mb-2 border-0 rounded-b-lg rounded-xl text-inherit"
                >
                  <div class="flex items-center">
                    <div
                      class="inline-block w-8 h-8 mr-4 text-center text-black bg-center shadow-sm fill-current stroke-none bg-gradient-to-tl from-zinc-800 to-zinc-700 dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 rounded-xl"
                    >
                      <i
                        class="text-white ni ni-box-2 relative top-0.75 text-xxs"
                      ></i>
                    </div>
                    <div class="flex flex-col">
                      <h6
                        class="mb-1 text-sm leading-normal text-slate-700 dark:text-white"
                      >
                        Error logs
                      </h6>
                      <span class="text-xs leading-tight dark:text-white/80"
                        >1 is active,
                        <span class="font-semibold">40 closed</span></span
                      >
                    </div>
                  </div>
                  <div class="flex">
                    <button
                      class="group ease-in leading-pro text-xs rounded-3.5xl p-1.2 h-6.5 w-6.5 mx-0 my-auto inline-block cursor-pointer border-0 bg-transparent text-center align-middle font-bold text-slate-700 shadow-none transition-all dark:text-white"
                    >
                      <i
                        class="ni ease-bounce text-2xs group-hover:translate-x-1.25 ni-bold-right transition-all duration-200"
                        aria-hidden="true"
                      ></i>
                    </button>
                  </div>
                </li>
                <li
                  class="relative flex justify-between py-2 pr-4 border-0 rounded-b-lg rounded-xl text-inherit"
                >
                  <div class="flex items-center">
                    <div
                      class="inline-block w-8 h-8 mr-4 text-center text-black bg-center shadow-sm fill-current stroke-none bg-gradient-to-tl from-zinc-800 to-zinc-700 dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 rounded-xl"
                    >
                      <i
                        class="text-white ni ni-satisfied relative top-0.75 text-xxs"
                      ></i>
                    </div>
                    <div class="flex flex-col">
                      <h6
                        class="mb-1 text-sm leading-normal text-slate-700 dark:text-white"
                      >
                        Happy users
                      </h6>
                      <span class="text-xs leading-tight dark:text-white/80"
                        ><span class="font-semibold">+ 430 </span></span
                      >
                    </div>
                  </div>
                  <div class="flex">
                    <button
                      class="group ease-in leading-pro text-xs rounded-3.5xl p-1.2 h-6.5 w-6.5 mx-0 my-auto inline-block cursor-pointer border-0 bg-transparent text-center align-middle font-bold text-slate-700 shadow-none transition-all dark:text-white"
                    >
                      <i
                        class="ni ease-bounce text-2xs group-hover:translate-x-1.25 ni-bold-right transition-all duration-200"
                        aria-hidden="true"
                      ></i>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- cards row 4 -->

      <div class="flex flex-wrap mt-6 -mx-3">
        <div class="w-full max-w-full px-3 mt-0 lg:w-5/12 lg:flex-none">
          <div
            class="border-black/12.5 shadow-xl dark:bg-gray-950 dark:border-[var(--dark-border-color)] dark:shadow-dark-xl relative flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border"
          >
            <div class="p-4 pb-0 rounded-t-4">
              <h6 class="mb-0 dark:text-white">Items rate</h6>
            </div>
            <div class="flex-auto p-4">
              <ChartsProductPieChart />
            </div>
          </div>
        </div>
        <div
          class="w-full max-w-full px-3 mt-0 mb-6 lg:mb-0 lg:w-7/12 lg:flex-none"
        >
          <div
            class="relative flex flex-col min-w-0 break-words bg-white border-0 dark:border dark:border-[var(--dark-border-color)] border-solid shadow-xl dark:shadow-dark-xl dark:bg-gray-950 border-black-125 rounded-2xl bg-clip-border"
          >
            <div class="p-4 pb-0 mb-0 rounded-t-4">
              <div class="flex justify-between">
                <h6 class="mb-2 dark:text-white">Website activity</h6>
              </div>
            </div>
            <div class="overflow-x-auto px-4 py-6">
              <ChartsActiveUsersChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const burgerActive = ref(false);


const handleSidebarToggle = (state) => {
  burgerActive.value = state;
};

definePageMeta({
  layout: "admin",
});
</script>
