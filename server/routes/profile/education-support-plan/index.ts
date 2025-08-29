import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import EducationSupportPlanController from './educationSupportPlanController'
import retrieveEducationSupportPlan from '../middleware/retrieveEducationSupportPlan'
import { Services } from '../../../services'

const educationSupportPlanRoutes = (services: Services): Router => {
  const { educationSupportPlanService } = services
  const controller = new EducationSupportPlanController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveEducationSupportPlan(educationSupportPlanService),
      asyncMiddleware(controller.getEducationSupportPlanView),
    ])
}

export default educationSupportPlanRoutes
