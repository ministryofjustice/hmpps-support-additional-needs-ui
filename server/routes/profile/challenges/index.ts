import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import ChallengesController from './challengesController'
import { Services } from '../../../services'
import retrieveCurrentChallenges from '../middleware/retrieveCurrentChallenges'
import retrieveAlnScreeners from '../../middleware/retrieveAlnScreeners'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'
import retrieveEducationSupportPlanLifecycleStatus from '../middleware/retrieveEducationSupportPlanLifecycleStatus'

const challengesRoutes = (services: Services): Router => {
  const { additionalLearningNeedsService, challengeService, educationSupportPlanService, prisonService } = services
  const controller = new ChallengesController()

  return Router({ mergeParams: true }) //
    .get('/', [
      retrieveEducationSupportPlanLifecycleStatus(educationSupportPlanService),
      retrievePrisonsLookup(prisonService),
      retrieveCurrentChallenges(challengeService),
      retrieveAlnScreeners(additionalLearningNeedsService),
      asyncMiddleware(controller.getChallengesView),
    ])
}

export default challengesRoutes
