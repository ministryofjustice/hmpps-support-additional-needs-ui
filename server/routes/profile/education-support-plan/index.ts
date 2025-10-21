import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import EducationSupportPlanController from './educationSupportPlanController'
import retrieveEducationSupportPlan from '../middleware/retrieveEducationSupportPlan'
import { Services } from '../../../services'
import retrieveEducationSupportPlanLifecycleStatus from '../middleware/retrieveEducationSupportPlanLifecycleStatus'
import retrieveEducationSupportPlanReviews from '../middleware/retrieveEducationSupportPlanReviews'

const educationSupportPlanRoutes = (services: Services): Router => {
  const { educationSupportPlanService, educationSupportPlanReviewService } = services
  const controller = new EducationSupportPlanController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveEducationSupportPlanLifecycleStatus(educationSupportPlanService),
      retrieveEducationSupportPlan(educationSupportPlanService),
      retrieveEducationSupportPlanReviews(educationSupportPlanReviewService),
      asyncMiddleware(controller.getEducationSupportPlanView),
    ])
}

export default educationSupportPlanRoutes
