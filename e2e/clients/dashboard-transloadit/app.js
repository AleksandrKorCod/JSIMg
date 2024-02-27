import { JSIMg } from '@JSIMg/core'
import Dashboard from '@JSIMg/dashboard'
import Transloadit from '@JSIMg/transloadit'

import generateSignatureIfSecret from './generateSignatureIfSecret.js'

import '@JSIMg/core/dist/style.css'
import '@JSIMg/dashboard/dist/style.css'

// Environment variables:
// https://en.parceljs.org/env.html
const JSIMg = new JSIMg()
  .use(Dashboard, { target: '#app', inline: true })
  .use(Transloadit, {
    service: process.env.VITE_TRANSLOADIT_SERVICE_URL,
    waitForEncoding: true,
    getAssemblyOptions: () => generateSignatureIfSecret(process.env.VITE_TRANSLOADIT_SECRET, {
      auth: { key: process.env.VITE_TRANSLOADIT_KEY },
      template_id: process.env.VITE_TRANSLOADIT_TEMPLATE,
    }),
  })

// Keep this here to access JSIMg in tests
window.JSIMg = JSIMg
