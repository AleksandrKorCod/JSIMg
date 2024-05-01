import http from 'node:http'
export default function startMockServer (host, port) {
  const server = http.createServer(requestListener)
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
  })
const requestListener = (req, res) => {
  const endpoint = req.url

  switch (endpoint) {
    case '/file-with-content-disposition': {
      const fileName = `IMG`
      res.setHeader('Content-Disposition', `attachment; filename="ASCII-name.zip"; filename*=UTF-8''${encodeURIComponent(fileName)}`)
      res.setHeader('Content-Type', 'image/jpeg')
      res.setHeader('Content-Length', '86500')
      break
    }
    case '/file-no-headers':
      break
    default:
      res.writeHead(404).end('Unhandled req')
  }

  res.end()
}

}

