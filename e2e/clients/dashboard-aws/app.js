import '@JSIMg/core/dist/style.css'
import '@JSIMg/dashboard/dist/style.css'
import Dashboard from '@JSIMg/dashboard'
import AwsS3 from '@JSIMg/aws-s3'



const JSIMg = new JSIMg()
  .use(Dashboard, { target: '#app', inline: true })
  .use(AwsS3, {
    limit: 2,
    companionUrl: process.env.VITE_COMPANION_URL,
  })

