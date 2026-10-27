<template>
  <div class="page">
    <Hero />
    <VideoComponent :hero-video="true" src="https://fast.wistia.com/embed/mi2sa50wnp.js" media-id="mi2sa50wnp"/>
    <Options />
    <VideosSection />
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
