<template>
  <NuxtLayout>
    <NuxtPage />
    <IconLibrary />
    <noscript>
      <img
        height="1"
        width="1"
        style="display: none"
        src="https://www.facebook.com/tr?id=1541485453520508&ev=PageView&noscript=1"
      />
    </noscript>
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "#app";
import IconLibrary from "./components/shared/IconLibrary.vue";

import { useModalStore } from "./stores/modal";


const modalStore = useModalStore();

useHead({
  meta: [
    { name: 'color-scheme', content: 'light' }
  ]
})

// useHead({
//   meta: [
//     {
//       name: "facebook-domain-verification",
//       content: "wzdp1app2xxgco9ejbc04zwjc2w0ub",
//     },
//   ],
//   script: [
//     {
//       key: "facebook-pixel",
//       children: `
//         !function(f,b,e,v,n,t,s)
//         {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//         n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//         if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//         n.queue=[];t=b.createElement(e);t.async=!0;
//         t.src=v;s=b.getElementsByTagName(e)[0];
//         s.parentNode.insertBefore(t,s)}(window, document,'script',
//         'https://connect.facebook.net/en_US/fbevents.js');
//         fbq('init', '1541485453520508');
//         fbq('track', 'PageView');
//       `,
//       type: "text/javascript",
//     },
//   ],
// });

const utmStore = useUtmStore();


onMounted( () => {

   if (!localStorage.getItem("landing_time")) {
    localStorage.setItem(
      "landing_time",
      Date.now().toString()
    )
  }

  if (utmStore.pending) {

    utmStore.openCookieModal()

  }

})
</script>
