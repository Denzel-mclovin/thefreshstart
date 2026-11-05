<template>
  <!-- <NuxtLayout>
    <NuxtPage />
    <IconLibrary />
    <noscript>
      <img
        height="1"
        width="1"
        style="display: none"
        src="https://www.facebook.com/tr?id=1850667959625451&ev=PageView&noscript=1"
      />
    </noscript>
  </NuxtLayout> -->

   <NuxtLayout>
    <NuxtPage />
    <IconLibrary />
  </NuxtLayout>
</template>

<script setup>




// import { onMounted } from "vue";
// import { useRoute } from "#app";
// import IconLibrary from "./components/shared/IconLibrary.vue";

// import { useModalStore } from "./stores/modal";


// const modalStore = useModalStore();

// useHead({
//   meta: [
//     { name: 'color-scheme', content: 'light' }
//   ]
// })

// const utmStore = useUtmStore();


// onMounted( () => {

//    if (!localStorage.getItem("landing_time")) {
//     localStorage.setItem(
//       "landing_time",
//       Date.now().toString()
//     )
//   }

// })

import { onMounted } from "vue";
import IconLibrary from "./components/shared/IconLibrary.vue";

const modalStore = useModalStore();
const utmStore = useUtmStore();

useHead({
  meta: [{ name: "color-scheme", content: "light" }],
  noscript: [
    {
      tagPosition: "bodyOpen",
      innerHTML:
        '<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=1850667959625451&amp;ev=PageView&amp;noscript=1" />',
    },
  ],
});

onMounted(() => {
  if (!localStorage.getItem("landing_time")) {
    localStorage.setItem("landing_time", Date.now().toString());
  }
});
</script>
