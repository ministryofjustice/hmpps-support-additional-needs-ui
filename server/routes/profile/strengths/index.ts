import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import StrengthsController from './strengthsController'

const strengthsRoutes = (): Router => {
  const controller = new StrengthsController()

  return Router({ mergeParams: true }) //
    .get('/', [asyncMiddleware(controller.getStrengthsView)])
}

export default strengthsRoutes
