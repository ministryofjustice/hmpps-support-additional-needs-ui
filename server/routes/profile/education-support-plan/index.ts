import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import EducationSupportPlanController from './educationSupportPlanController'
import retrieveEducationSupportPlan from '../middleware/retrieveEducationSupportPlan'
import { Services } from '../../../services'
import retrieveEducationSupportPlanLifecycleStatus from '../middleware/retrieveEducationSupportPlanLifecycleStatus'

const educationSupportPlanRoutes = (services: Services): Router => {
  const { educationSupportPlanService } = services
  const controller = new EducationSupportPlanController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveEducationSupportPlanLifecycleStatus(educationSupportPlanService),
      retrieveEducationSupportPlan(educationSupportPlanService),
      asyncMiddleware(controller.getEducationSupportPlanView),
    ])
}

export default educationSupportPlanRoutes
