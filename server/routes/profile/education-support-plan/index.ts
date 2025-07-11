import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import EducationSupportPlanController from './educationSupportPlanController'

const educationSupportPlanRoutes = (): Router => {
  const controller = new EducationSupportPlanController()

  return Router({ mergeParams: true }) //
    .get('/', [asyncMiddleware(controller.getEducationSupportPlanView)])
}

export default educationSupportPlanRoutes
