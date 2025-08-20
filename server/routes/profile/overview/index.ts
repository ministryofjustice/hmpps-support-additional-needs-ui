import { Router } from 'express'
import { Services } from '../../../services'
import OverviewController from './overviewController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import retrieveCurrentEducationSupportPlanCreationSchedule from '../middleware/retrieveCurrentEducationSupportPlanCreationSchedule'
import retrieveConditions from '../middleware/retrieveConditions'

const overviewRoutes = (services: Services): Router => {
  const { conditionService, educationSupportPlanScheduleService } = services
  const controller = new OverviewController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveCurrentEducationSupportPlanCreationSchedule(educationSupportPlanScheduleService),
      retrieveConditions(conditionService),
      asyncMiddleware(controller.getOverviewView),
    ])
}

export default overviewRoutes
