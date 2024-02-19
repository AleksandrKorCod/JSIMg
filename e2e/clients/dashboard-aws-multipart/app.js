import Dashboard from '@JSIMg/dashboard'
import AwsS3Multipart from '@JSIMg/aws-s3-multipart'

import '@JSIMg/core/dist/style.css'
import '@JSIMg/dashboard/dist/style.css'

//#TODO tests
const JSIMg = new JSIMg()
  .use(Dashboard, { target: '#app', inline: true })
  .use(AwsS3Multipart, {
    limit: 2,
    companionUrl: process.env.VITE_COMPANION_URL,
    // This way we can test that the user provided API still works
    async prepareUploadParts (file, { uploadId, key, parts, signal }) {
      const { number: partNumber, chunk: body } = parts[0]
      const plugin = JSIMg.getPlugin('AwsS3Multipart')
      const { url } = await plugin.signPart(file, { uploadId, key, partNumber, body, signal })
      return { presignedUrls: { [partNumber]: url } }
    },
  })

// Keep this here to access JSIMg in tests
window.JSIMg = JSIMg
