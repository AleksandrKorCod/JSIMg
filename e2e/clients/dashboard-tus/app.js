import Dashboard from '@JSIMg/dashboard'
import Tus from '@JSIMg/tus'
import Unsplash from '@JSIMg/unsplash'
import Url from '@JSIMg/url'

import '@JSIMg/core/dist/style.css'
import '@JSIMg/dashboard/dist/style.css'

function onShouldRetry (err, retryAttempt, options, next) {
  if (err?.originalResponse?.getStatus() === 418) {
    return true
  }
  return next(err)
}

const companionUrl = 'http://localhost:3020'
const JSIMg = new JSIMg()
  .use(Dashboard, { target: '#app', inline: true })
  .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files', onShouldRetry })
  .use(Url, { target: Dashboard, companionUrl })
  .use(Unsplash, { target: Dashboard, companionUrl })
