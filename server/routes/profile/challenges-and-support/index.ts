import { Router } from 'express'
import { Services } from '../../../services'
import ChallengesAndSupportController from './challengesAndSupportController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import retrieveEducationSupportPlanLifecycleStatus from '../middleware/retrieveEducationSupportPlanLifecycleStatus'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'
import retrieveChallenges from '../../middleware/retrieveChallenges'
import retrieveSupportStrategies from '../../middleware/retrieveSupportStrategies'
import retrieveAlnScreeners from '../../middleware/retrieveAlnScreeners'

const challengesAndSupportRoutes = (services: Services): Router => {
  const {
    additionalLearningNeedsService,
    challengeService,
    educationSupportPlanService,
    prisonService,
    supportStrategyService,
  } = services
  const controller = new ChallengesAndSupportController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveEducationSupportPlanLifecycleStatus(educationSupportPlanService),
      retrievePrisonsLookup(prisonService),
      retrieveChallenges(challengeService),
      retrieveAlnScreeners(additionalLearningNeedsService),
      retrieveSupportStrategies(supportStrategyService),

      asyncMiddleware(controller.getChallengesAndSupportView),
    ])
}

export default challengesAndSupportRoutes
