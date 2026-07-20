<template>
  <div class="page">
    <Hero />
    <VideoComponent />
    <Options />
    <Results />
    <Faq />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useModalStore } from "../stores/modal";
import { useUTMTracking } from "../composables/useUTMTracking";

const modalStore = useModalStore();

const cookieConsent = useCookie("cookie_consent");
const { utmSource, utmMedium, utmCampaign, utmContent } = useUTMTracking();

if (import.meta.client) {
  useHead({
    script: [
      {
        innerHTML: `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1541485453520508');
        fbq('track', 'PageView');
      `,
        type: "text/javascript",
      },
    ],
    noscript: [
      {
        children: `
        <img height="1" width="1" style="display:none"
             src="https://www.facebook.com/tr?id=1541485453520508&ev=PageView&noscript=1" />
      `,
      },
    ],
  });
}

// onMounted(() => {

//   if (cookieConsent.value === 'accepted') return

//   const urlParams = new URLSearchParams(window.location.search)
//   // const hasUTM = urlParams.has('utm_source') || urlParams.has('utm_medium') ||
//   //                urlParams.has('utm_campaign') || urlParams.has('utm_content')

//   const hasUTM = urlParams.has('utm_source') || urlParams.has('utm_medium') ||
//                urlParams.has('utm_campaign') || urlParams.has('utm_content') ||
//                utmSource.value || utmMedium.value || utmCampaign.value || utmContent.value

//   if (hasUTM) {
//     setTimeout(() => {
//       modalStore.showModal('CookieNotification', {})
//     }, 3000)
//   }

// })

// LINK EXAMPLE
// localhost:3000/?utm_source=tiktok&utm_content=clip1

// generating URL

// function generateUTMUrl(baseUrl: string, params: Record<string,string>) {
//   const url = new URL(baseUrl)
//   Object.entries(params).forEach(([key, value]) => {
//     if (value) url.searchParams.set(key, value)
//   })
//   return url.toString()
// }

// const base = "https://www.google.com/"
// const utmParams = {
//   utm_source: "instagram",
//   utm_medium: "social",
//   utm_campaign: "spring_launch",
//   utm_content: "reel14_53s",
//   utm_term: "tiktok_influencer"
// }

// const finalUrl = generateUTMUrl(base, utmParams)
// console.log(finalUrl)
</script>

<style lang="scss" scoped>
@use "/styles/mixins.scss" as mixins;

.page {
  @include mixins.page-spacing;

  padding-top: 60px;

  @media screen and (max-width: 1024px) {
    padding-top: 50px;
  }

  @media screen and (max-width: 768px) {
    padding-top: 40px;
  }

  @media screen and (max-width: 480px) {
    padding-top: 25px;
  }
}
</style>
