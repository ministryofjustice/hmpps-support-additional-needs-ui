import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import StrengthsController from './strengthsController'
import { Services } from '../../../services'
import retrieveStrengths from '../middleware/retrieveStrengths'

const strengthsRoutes = (services: Services): Router => {
  const { strengthService } = services
  const controller = new StrengthsController()

  return Router({ mergeParams: true }) //
    .get('/', [retrieveStrengths(strengthService), asyncMiddleware(controller.getStrengthsView)])
}

export default strengthsRoutes
