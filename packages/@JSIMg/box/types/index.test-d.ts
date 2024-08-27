import JSIMg from '@JSIMg/core'
import Box from '..'

{
  const JSIMg = new JSIMg()
  JSIMg.use(Box, {
    companionUrl: '',
    companionCookiesRule: 'same-origin',
    target: 'body',
    title: 'title',
  })
}
