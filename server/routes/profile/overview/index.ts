import { Router } from 'express'
import { Services } from '../../../services'
import OverviewController from './overviewController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import retrieveConditions from '../../middleware/retrieveConditions'
import retrieveStrengths from '../../middleware/retrieveStrengths'
import retrieveAlnScreeners from '../../middleware/retrieveAlnScreeners'
import retrieveChallenges from '../../middleware/retrieveChallenges'
import retrieveCuriousAlnAndLddAssessments from '../middleware/retrieveCuriousAlnAndLddAssessments'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'
import retrieveEducationSupportPlanLifecycleStatus from '../middleware/retrieveEducationSupportPlanLifecycleStatus'
import retrieveSupportStrategies from '../../middleware/retrieveSupportStrategies'

const overviewRoutes = (services: Services): Router => {
  const {
    additionalLearningNeedsService,
    challengeService,
    conditionService,
    curiousService,
    educationSupportPlanService,
    prisonService,
    strengthService,
    supportStrategyService,
  } = services
  const controller = new OverviewController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveEducationSupportPlanLifecycleStatus(educationSupportPlanService),
      retrieveAlnScreeners(additionalLearningNeedsService),
      retrieveConditions(conditionService),
      retrieveStrengths(strengthService),
      retrieveChallenges(challengeService),
      retrieveCuriousAlnAndLddAssessments(curiousService),
      retrievePrisonsLookup(prisonService),
      retrieveSupportStrategies(supportStrategyService),
      asyncMiddleware(controller.getOverviewView),
    ])
}

export default overviewRoutes
