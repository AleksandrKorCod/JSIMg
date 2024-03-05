import JSIMg from '@JSIMg/core'
import Dashboard from '@JSIMg/dashboard'
import RemoteSources from '@JSIMg/remote-sources'
import Webcam from '@JSIMg/webcam'
import ScreenCapture from '@JSIMg/screen-capture'
import GoldenRetriever from '@JSIMg/golden-retriever'
import ImageEditor from '@JSIMg/image-editor'
import DropTarget from '@JSIMg/drop-target'
import Audio from '@JSIMg/audio'
import Compressor from '@JSIMg/compressor'

import '@JSIMg/core/dist/style.css'
import '@JSIMg/dashboard/dist/style.css'

const COMPANION_URL = 'http://companion.JSIMg.io'

const JSIMg = new JSIMg()
  .use(Dashboard, { target: '#app', inline: true })
  .use(RemoteSources, { companionUrl: COMPANION_URL })
  .use(Webcam, {
    target: Dashboard,
    showVideoSourceDropdown: true,
    showRecordingLength: true,
  })
  .use(Audio, {
    target: Dashboard,
    showRecordingLength: true,
  })
  .use(ScreenCapture, { target: Dashboard })
  .use(ImageEditor, { target: Dashboard })
  .use(DropTarget, { target: document.body })
  .use(Compressor)
  .use(GoldenRetriever, { serviceWorker: true })

// Keep this here to access JSIMg in tests
window.JSIMg = JSIMg
