<template>
   <NuxtLayout>
    <NuxtPage />
    <IconLibrary />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from "vue";
import IconLibrary from "./components/shared/IconLibrary.vue";

const modalStore = useModalStore();
const utmStore = useUtmStore();
const config = useRuntimeConfig();

const isProdEnv =
  process.env.VERCEL_ENV === "production" ||
  Boolean(config.public?.siteUrl && config.public.siteUrl.includes("thefreshstart.net"));

useHead({
  meta: [{ name: "color-scheme", content: "light" }],
  noscript: isProdEnv
    ? [
        {
          tagPosition: "bodyOpen",
          innerHTML:
            '<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=1850667959625451&amp;ev=PageView&amp;noscript=1" />',
        },
      ]
    : [],
});

onMounted(() => {
  if (!localStorage.getItem("landing_time")) {
    localStorage.setItem("landing_time", Date.now().toString());
  }
});
</script>
