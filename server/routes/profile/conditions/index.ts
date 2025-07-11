import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import ConditionsController from './conditionsController'

const conditionsRoutes = (): Router => {
  const controller = new ConditionsController()

  return Router({ mergeParams: true }) //
    .get('/', [asyncMiddleware(controller.getConditionsView)])
}

export default conditionsRoutes
