import { Router } from 'express'
import { Services } from '../../../services'
import OverviewController from './overviewController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import retrieveCurrentEducationSupportPlanCreationSchedule from '../middleware/retrieveCurrentEducationSupportPlanCreationSchedule'
import retrieveConditions from '../middleware/retrieveConditions'
import retrieveStrengths from '../middleware/retrieveStrengths'
import retrieveAlnScreeners from '../middleware/retrieveAlnScreeners'

const overviewRoutes = (services: Services): Router => {
  const { additionalLearningNeedsService, conditionService, educationSupportPlanScheduleService, strengthService } =
    services
  const controller = new OverviewController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveCurrentEducationSupportPlanCreationSchedule(educationSupportPlanScheduleService),
      retrieveAlnScreeners(additionalLearningNeedsService),
      retrieveConditions(conditionService),
      retrieveStrengths(strengthService),
      asyncMiddleware(controller.getOverviewView),
    ])
}

export default overviewRoutes
