import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import ConditionsController from './conditionsController'
import { Services } from '../../../services'
import retrieveConditions from '../middleware/retrieveConditions'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'
import retrieveEducationSupportPlanLifecycleStatus from '../middleware/retrieveEducationSupportPlanLifecycleStatus'

const conditionsRoutes = (services: Services): Router => {
  const { conditionService, educationSupportPlanService, prisonService } = services
  const controller = new ConditionsController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveEducationSupportPlanLifecycleStatus(educationSupportPlanService),
      retrievePrisonsLookup(prisonService),
      retrieveConditions(conditionService),
      asyncMiddleware(controller.getConditionsView),
    ])
}

export default conditionsRoutes
