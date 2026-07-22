import { VueReCaptcha } from 'vue-recaptcha-v3';
// import { useRuntimeConfig, defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin((nuxtApp) => {
    
    const config = useRuntimeConfig();


    nuxtApp.vueApp.use(VueReCaptcha as any, {
        siteKey: String(config.public.recaptchaSiteKey),
        version: 3,
        autoHideBadge: true,
    })
})
