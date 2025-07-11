import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import SupportStrategiesController from './supportStrategiesController'

const supportStrategiesRoutes = (): Router => {
  const controller = new SupportStrategiesController()

  return Router({ mergeParams: true }) //
    .get('/', [asyncMiddleware(controller.getSupportStrategiesView)])
}

export default supportStrategiesRoutes
