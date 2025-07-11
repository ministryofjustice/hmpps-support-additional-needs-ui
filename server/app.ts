import express from 'express'

import createError from 'http-errors'
import dpsComponents from '@ministryofjustice/hmpps-connect-dps-components'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import { appInsightsMiddleware } from './utils/azureAppInsights'
import authorisationMiddleware from './middleware/authorisationMiddleware'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'

import routes from './routes'
import type { Services } from './services'
import errorMessageMiddleware from './middleware/errorMessageMiddleware'
import successMessageMiddleware from './middleware/successMessageMiddleware'
import config from './config'
import logger from '../logger'
import auditMiddleware from './middleware/auditMiddleware'
import apiErrorMiddleware from './middleware/apiErrorMiddleware'
import requestHelpersMiddleware from './middleware/requestHelpersMiddleware'

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(appInsightsMiddleware())
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app)
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware())
  app.use(setUpCsrf())
  app.use(setUpCurrentUser(services))
  app.use(apiErrorMiddleware())
  app.use(successMessageMiddleware)
  app.use(errorMessageMiddleware)
  app.use(requestHelpersMiddleware)

  app.get(/(.*)/, dpsComponents.getPageComponents({ useFallbacksByDefault: true, dpsUrl: config.newDpsUrl, logger }))

  app.use(auditMiddleware(services))
  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(services, config.production))

  app.locals.applicationInsightsConnectionString = config.applicationInsights.connectionString
  app.locals.applicationInsightsRoleName = services.applicationInfo.applicationName

  return app
}
