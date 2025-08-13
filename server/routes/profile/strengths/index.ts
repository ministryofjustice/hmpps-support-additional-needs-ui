import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import StrengthsController from './strengthsController'
import { Services } from '../../../services'
import retrieveStrengths from '../middleware/retrieveStrengths'
import retrieveAlnScreeners from '../middleware/retrieveAlnScreeners'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'

const strengthsRoutes = (services: Services): Router => {
  const { additionalLearningNeedsService, prisonService, strengthService } = services
  const controller = new StrengthsController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrievePrisonsLookup(prisonService),
      retrieveStrengths(strengthService),
      retrieveAlnScreeners(additionalLearningNeedsService),
      asyncMiddleware(controller.getStrengthsView),
    ])
}

export default strengthsRoutes
