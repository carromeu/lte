import { registerPlugins } from '@/plugins'
import VueMatomo from 'vue-matomo'
import * as Sentry from '@sentry/vue'

import App from './App.vue'

import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.use(VueMatomo, {
  host: 'https://hit.embrapa.io',
  siteId: import.meta.env.VITE_MATOMO_ID,
  preInitActions: [
    ['setCustomDimension', 1, import.meta.env.VITE_STAGE],
    ['setCustomDimension', 2, import.meta.env.VITE_VERSION]
  ]
})

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  release: import.meta.env.VITE_VERSION.split('-')[0],
  environment: import.meta.env.VITE_STAGE,
  integrations: [
    Sentry.replayIntegration()
  ],
  tracesSampleRate: 1.0
})

app.mount('#app')
