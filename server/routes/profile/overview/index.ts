import { Router } from 'express'
import { Services } from '../../../services'
import OverviewController from './overviewController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import retrieveCurrentEducationSupportPlanCreationSchedule from '../middleware/retrieveCurrentEducationSupportPlanCreationSchedule'

const overviewRoute = (services: Services): Router => {
  const { educationSupportPlanScheduleService } = services
  const controller = new OverviewController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveCurrentEducationSupportPlanCreationSchedule(educationSupportPlanScheduleService),
      asyncMiddleware(controller.getOverviewView),
    ])
}

export default overviewRoute
