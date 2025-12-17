import { Router } from 'express'
import { Services } from '../../../services'
import retrieveAlnScreeners from '../../middleware/retrieveAlnScreeners'
import retrieveConditions from '../../middleware/retrieveConditions'
import retrieveStrengths from '../../middleware/retrieveStrengths'
import retrieveChallenges from '../../middleware/retrieveChallenges'
import retrieveSupportStrategies from '../../middleware/retrieveSupportStrategies'
import AdditionalNeedsContentFragmentController from './additionalNeedsContentFragmentController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'

const additionalNeedsContentFragmentRoutes = (services: Services): Router => {
  const {
    additionalLearningNeedsService,
    challengeService,
    conditionService,
    strengthService,
    supportStrategyService,
  } = services
  const router = Router({ mergeParams: true })

  const additionalNeedsContentFragmentController = new AdditionalNeedsContentFragmentController()

  router.get('/', [
    retrieveAlnScreeners(additionalLearningNeedsService),
    retrieveConditions(conditionService),
    retrieveStrengths(strengthService),
    retrieveChallenges(challengeService),
    retrieveSupportStrategies(supportStrategyService),
    asyncMiddleware(additionalNeedsContentFragmentController.getAdditionalNeedsContentFragment),
  ])

  return router
}

export default additionalNeedsContentFragmentRoutes
