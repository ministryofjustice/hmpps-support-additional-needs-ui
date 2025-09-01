import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import SupportStrategiesController from './supportStrategiesController'
import retrieveSupportStrategies from '../middleware/retrieveSupportStrategies'
import { Services } from '../../../services'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'

const supportStrategiesRoutes = (services: Services): Router => {
  const { supportStrategyService } = services
  const controller = new SupportStrategiesController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrievePrisonsLookup(services.prisonService),
      retrieveSupportStrategies(supportStrategyService),
      asyncMiddleware(controller.getSupportStrategiesView),
    ])
}

export default supportStrategiesRoutes
