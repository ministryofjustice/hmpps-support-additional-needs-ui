import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import StrengthsController from './strengthsController'
import { Services } from '../../../services'
import retrieveStrengths from '../../middleware/retrieveStrengths'
import retrieveAlnScreeners from '../../middleware/retrieveAlnScreeners'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'
import retrieveEducationSupportPlanLifecycleStatus from '../middleware/retrieveEducationSupportPlanLifecycleStatus'

const strengthsRoutes = (services: Services): Router => {
  const { additionalLearningNeedsService, educationSupportPlanService, prisonService, strengthService } = services
  const controller = new StrengthsController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveEducationSupportPlanLifecycleStatus(educationSupportPlanService),
      retrievePrisonsLookup(prisonService),
      retrieveStrengths(strengthService),
      retrieveAlnScreeners(additionalLearningNeedsService),
      asyncMiddleware(controller.getStrengthsView),
    ])
}

export default strengthsRoutes
