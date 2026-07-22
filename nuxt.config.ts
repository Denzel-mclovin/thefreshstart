// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  components: true,
  devtools: { enabled: true },
   vue: {
    compilerOptions: {
      isCustomElement: (tag: any) => tag === 'wistia-player'
    }
  },
  nitro: {
    compressPublicAssets: true,
    serverAssets: [
      {
        baseName: 'email',
        dir: 'server/assets'
      }
    ]
  },
   runtimeConfig: {

    // supabaseKey: process.env.SUPABASE_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseApiUrl: process.env.SUPABASE_API_URL,

    // stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    // stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,

    adminUserName: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,

    sellerUsername: process.env.SELLER_USERNAME,
    sellerPassword: process.env.SELLER_PASSWORD,

    skoolApiKey: process.env.SKOOl_API_KEY,

    shopifyApiKey: process.env.SHOPIFY_API_KEY,
    shopifyApiSecret: process.env.SHOPIFY_API_SECRET,
    shopifyAccessToken: process.env.SHOPIFY_ACCESS_TOKEN,

    zohoAppPassword: process.env.ZOHO_APP_PASSWORD,
    calendlyToken: process.env.CALENDLY_TOKEN,


    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
    resendApiKEy: process.env.RESEND_API_KEY,

    public: {
      supabaseKey: process.env.SUPABASE_KEY,
      zohoAppHost: process.env.ZOHO_APP_HOST,
      zohoNoReplyUser: process.env.ZOHO_NO_REPLY_USER,
      shopifyStoreDomain: process.env.SHOPIFY_STORE_DOMAIN,
      // supabaseUrl: process.env.SUPABASE_URL,
      supabaseApiUrl: process.env.SUPABASE_API_URL,
      // stripePublicKey: process.env.STRIPE_PUBLIC_KEY
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
    }
  },
  app: {
    baseURL: '/',
    head: {
      meta: [
        {
          name: 'color-scheme',
          content: 'light'
        }
      ]
  },
  },
  css: [
    '~/styles/default.css',
    '~/styles/tailwind.css',
    '~/styles/main.scss',
    '~/styles/fonts.css'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [['@nuxtjs/google-fonts', {
    // families: {
    //   'Montserrat': [100, 200, 300, 400, 500, 600, 700, 800, 900],
    //   'Urbanist': [100, 200, 300, 400, 500, 600, 700, 800, 900],
    //   },
      families: {
        // 'Joane': [100, 200, 300, 400, 500, 600, 700, 800, 900],
        // 'Roboto': [100, 300, 400, 500, 600, 700, 800, 900],
        // 'DM Serif Display': [400, 500, 600, 700, 800, 900],
        'Merriweather': [300, 400, 700, 900],
        'Josefin Sans': [100, 200, 300, 400, 500, 600, 700, 800, 900],
        'Libre Baskerville': [400, 700],
        'Playfair Display': [400, 500, 600, 700, 800, 900],


      },
      display: 'swap',
    }], 
    '@pinia/nuxt',
    "@nuxt/image",
    ['@nuxtjs/tailwindcss', {
        exposeConfig: true,
        viewer: true,
      }
    ]
  ],
  image: {
    provider: 'none',
    dir: 'public',
    format: ['webp', 'avif', 'jpeg', 'png'],
  },
  alias: {
    '@': './',
    '~': './'
  },
  typescript: {
    strict: false,
  },
  experimental: {
    componentIslands: true,
  },
  vite: {
    server: {
      allowedHosts: ['69dd817741f9.ngrok-free.app'],
    },
  },

})
