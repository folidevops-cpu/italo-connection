// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // CSS Configuration
  css: ['~/assets/css/main.css'],
  
  // Modules Configuration
  modules: [
    'nuxt-auth-utils',
    '@prisma/nuxt',
    '@nuxtjs/i18n',
  ],
  
  // i18n Configuration
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'fr',
        name: 'Français',
        file: 'fr.json'
      },
      {
        code: 'it',
        name: 'Italiano',
        file: 'it.json'
      }
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: 'locales/',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    }
  },
  
  // Runtime Configuration
  runtimeConfig: {
    // Server-only environment variables
    authSecret: process.env.NUXT_AUTH_SECRET,
    apiBaseUrl: process.env.NUXT_API_BASE_URL,
    
    // Database
    databaseUrl: process.env.DATABASE_URL,
    
    // AWS Configuration
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    awsS3Bucket: process.env.AWS_S3_BUCKET,
    
    // Email Configuration
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFromEmail: process.env.SMTP_FROM_EMAIL,
    smtpFromName: process.env.SMTP_FROM_NAME,
    adminEmail: process.env.ADMIN_EMAIL,
    
    // SMS Configuration
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
    
    // OAuth Configuration
    oauth: {
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET
      }
    },
    
    public: {
      // Client-side accessible variables
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    }
  },
  
  // Development server configuration
  devServer: {
    host: '127.0.0.1',
    port: 3000
  },
  
  // Nitro configuration to fix socket issues
  nitro: {
    experimental: {
      wasm: false
    }
  },
  
  // Vite Configuration
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
})