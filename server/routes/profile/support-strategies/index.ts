import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import SupportStrategiesController from './supportStrategiesController'
import retrieveSupportStrategies from '../../middleware/retrieveSupportStrategies'
import { Services } from '../../../services'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'
import retrieveEducationSupportPlanLifecycleStatus from '../middleware/retrieveEducationSupportPlanLifecycleStatus'

const supportStrategiesRoutes = (services: Services): Router => {
  const { educationSupportPlanService, supportStrategyService, prisonService } = services
  const controller = new SupportStrategiesController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveEducationSupportPlanLifecycleStatus(educationSupportPlanService),
      retrievePrisonsLookup(prisonService),
      retrieveSupportStrategies(supportStrategyService),
      asyncMiddleware(controller.getSupportStrategiesView),
    ])
}

export default supportStrategiesRoutes
