import { defineConfig } from 'cypress'
import installLogsPrinter from 'cypress-terminal-report/src/installLogsPrinter.js'
import startMockServer from './mock-server.mjs'

export default defineConfig({
  defaultCommandTimeout: 16_000,
  requestTimeout: 16_000,

  e2e: {
    baseUrl: 'http://localhost:8090',
    specPattern: 'cypress/integration/*main.spec.ts',

    setupNodeEvents (on) {
      // implement node event listeners here
      installLogsPrinter(on)

      startMockServer('localhost', 9999)
    },
  },
})
