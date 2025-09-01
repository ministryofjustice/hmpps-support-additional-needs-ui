import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import SupportStrategiesController from './supportStrategiesController'
import retrieveSupportStrategies from '../middleware/retrieveSupportStrategies'
import { Services } from '../../../services'

const supportStrategiesRoutes = (services: Services): Router => {
  const { supportStrategyService } = services
  const controller = new SupportStrategiesController()

  return Router({ mergeParams: true }) //
    .get('/', [retrieveSupportStrategies(supportStrategyService), asyncMiddleware(controller.getSupportStrategiesView)])
}

export default supportStrategiesRoutes
