import { Router } from 'express'
import { Services } from '../../../services'
import OverviewController from './overviewController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import retrieveCurrentEducationSupportPlanCreationSchedule from '../middleware/retrieveCurrentEducationSupportPlanCreationSchedule'
import retrieveConditions from '../middleware/retrieveConditions'
import retrieveStrengths from '../middleware/retrieveStrengths'
import retrieveAlnScreeners from '../middleware/retrieveAlnScreeners'
import retrieveCurrentChallenges from '../middleware/retrieveCurrentChallenges'
import retrieveCuriousAlnAndLddAssessments from '../middleware/retrieveCuriousAlnAndLddAssessments'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'

const overviewRoutes = (services: Services): Router => {
  const {
    additionalLearningNeedsService,
    challengeService,
    conditionService,
    curiousService,
    educationSupportPlanScheduleService,
    prisonService,
    strengthService,
  } = services
  const controller = new OverviewController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveCurrentEducationSupportPlanCreationSchedule(educationSupportPlanScheduleService),
      retrieveAlnScreeners(additionalLearningNeedsService),
      retrieveConditions(conditionService),
      retrieveStrengths(strengthService),
      retrieveCurrentChallenges(challengeService),
      retrieveCuriousAlnAndLddAssessments(curiousService),
      retrievePrisonsLookup(prisonService),
      asyncMiddleware(controller.getOverviewView),
    ])
}

export default overviewRoutes
