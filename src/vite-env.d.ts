/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_ID: string
  readonly VITE_SHOW_SEARCH_BAR_ON_HEADER: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  readonly VITE_GOOGLE_TAG_MANAGER_ID: string
  readonly VITE_SETTINGS_ENABLE_ADS: string
  readonly VITE_ADS_PROVIDER: string
  readonly VITE_GOOGLE_ADS_CLIENT_ID: string
  readonly VITE_GOOGLE_ADS_SLOT_HEADER: string
  readonly VITE_GOOGLE_ADS_SLOT_SIDEBAR: string
  readonly VITE_GOOGLE_ADS_SLOT_FOOTER: string
  readonly VITE_GOOGLE_ADS_SLOT_BETWEEN_LISTINGS: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  
  // Auth Settings
  readonly VITE_SETTINGS_AUTH_LOGIN_ENABLED: string
  readonly VITE_SETTINGS_ENABLE_TRACKING: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
