import fs from 'fs'
import path from 'node:path'
import webpackPreprocessor from '@cypress/webpack-batteries-included-preprocessor'
import { defineConfig } from 'cypress'
import { resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import prisonerSearchApi from './integration_tests/mockApis/prisonerSearchApi'
import prisonRegisterApi from './integration_tests/mockApis/prisonRegisterApi'
import manageUsersApi from './integration_tests/mockApis/manageUsersApi'
import supportAdditionalNeedsApi from './integration_tests/mockApis/supportAdditionalNeedsApi'
import personMockDataGenerator from './integration_tests/mockData/personMockDataGenerator'
import curiousApi from './integration_tests/mockApis/curiousApi'

function preprocessorOptions() {
  const replacementModulesPath = path.resolve(__dirname, './integration_tests/support/replacementModules')
  const options = webpackPreprocessor.defaultOptions
  options.typescript = require.resolve('typescript')
  options.webpackOptions.resolve.alias = {
    bunyan: path.join(replacementModulesPath, 'bunyan.ts'),
    'bunyan-format': path.join(replacementModulesPath, 'bunyan-format.ts'),
  }
  return options
}

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  video: true,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  e2e: {
    setupNodeEvents(on) {
      on('file:preprocessor', webpackPreprocessor(preprocessorOptions()))
      on('task', {
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message)
          return null
        },
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message)
          return null
        },
        reset: resetStubs,
        ...auth,
        ...tokenVerification,
        ...prisonerSearchApi,
        ...prisonRegisterApi,
        ...manageUsersApi,
        ...supportAdditionalNeedsApi,
        ...personMockDataGenerator,
        ...curiousApi,
      })
      on('after:spec', (spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = results.tests.some(test => test.attempts.some(attempt => attempt.state === 'failed'))
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            fs.unlinkSync(results.video)
          }
        }
      })
    },
    experimentalInteractiveRunEvents: true,
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
  },
})
