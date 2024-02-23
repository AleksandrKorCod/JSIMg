import Compressor from '@JSIMg/compressor'
import Dashboard from '@JSIMg/dashboard'
import '@JSIMg/core/dist/style.css'
import '@JSIMg/dashboard/dist/style.css'

const JSIMg = new JSIMg()
  .use(Dashboard, {
    target: document.body,
    inline: true,
  })
  .use(Compressor, {
    mimeType: 'image/webp',
  })

// Keep this here to access JSIMg in tests
window.JSIMg = JSIMg
