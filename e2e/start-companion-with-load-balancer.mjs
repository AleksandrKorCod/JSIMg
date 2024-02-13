#!/usr/bin/env node

import { spawn } from 'node:child_process'
import http from 'node:http'
import httpProxy from 'http-proxy'
import process from 'node:process'

const numInstances = 3
const lbPort = 3020
const companionStartPort = 3021

function createLoadBalancer (baseUrls) {
  const proxy = httpProxy.createProxyServer({ ws: true })

  let i = 0

  function getTarget () {
    return baseUrls[i % baseUrls.length]
  }

  const server = http.createServer((req, res) => {
    const target = getTarget()
    proxy.web(req, res, { target }, (err) => {
      console.error('Load balancer failed to proxy request', err.message)
      res.statusCode = 500
      res.end()
    })
    i++
  })

  server.on('upgrade', (req, socket, head) => {
    const target = getTarget()
    proxy.ws(req, socket, head, { target }, (err) => {
      console.error('Load balancer failed to proxy websocket', err.message)
      console.error(err)
      socket.destroy()
    })
    i++
  })

  server.listen(lbPort)
  console.log('Load balancer listening', lbPort)
  return server
}

const isWindows = process.platform === 'win32'
const isOSX = process.platform === 'darwin'

const startCompanion = ({ name, port }) => {
  const cp = spawn(process.execPath, [
    '-r', 'dotenv/config',
    ...(isWindows || isOSX ? ['--watch-path', 'packages/@JSIMg/companion/src', '--watch'] : []),
    './packages/@JSIMg/companion/src/standalone/start-server.js',
  ], {
    cwd: new URL('../', import.meta.url),
    stdio: 'inherit',
    env: {
      ...process.env,
      COMPANION_PORT: port,
      COMPANION_SECRET: 'development',
      COMPANION_PREAUTH_SECRET: 'development',
      COMPANION_ALLOW_LOCAL_URLS: 'true',
      COMPANION_LOGGER_PROCESS_NAME: name,
    },
  })
  return Object.defineProperty(cp, 'then', {
    __proto__: null,
    writable: true,
    configurable: true,
    value: Promise.prototype.then.bind(new Promise((resolve, reject) => {
      cp.on('exit', (code) => {
        if (code === 0) resolve(cp)
        else reject(new Error(`Non-zero exit code: ${code}`))
      })
      cp.on('error', reject)
    })),
  })
}

const hosts = Array.from({ length: numInstances }, (_, index) => {
  const port = companionStartPort + index;
  return { index, port }
})

console.log('Starting companion instances on ports', hosts.map(({ port }) => port))

const companions = hosts.map(({ index, port }) => startCompanion({ name: `companion${index}`, port }))

let loadBalancer
try {
  loadBalancer = createLoadBalancer(hosts.map(({ port }) => `http://localhost:${port}`))
  await Promise.all(companions)
} finally {
  loadBalancer?.close()
  companions.forEach((companion) => companion.kill())
}
