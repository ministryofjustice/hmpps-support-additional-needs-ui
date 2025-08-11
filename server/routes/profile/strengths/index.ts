import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import StrengthsController from './strengthsController'
import { Services } from '../../../services'
import retrieveStrengths from '../middleware/retrieveStrengths'
import retrieveAlnScreeners from '../middleware/retrieveAlnScreeners'

const strengthsRoutes = (services: Services): Router => {
  const { additionalLearningNeedsService, strengthService } = services
  const controller = new StrengthsController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveStrengths(strengthService),
      retrieveAlnScreeners(additionalLearningNeedsService),
      asyncMiddleware(controller.getStrengthsView),
    ])
}

export default strengthsRoutes
