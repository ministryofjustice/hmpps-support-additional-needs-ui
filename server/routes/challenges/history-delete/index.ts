import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import requireFeatureToggle from '../../../middleware/requireFeatureToggle'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveChallengeResponseDtoIfNotInJourneyData from '../middleware/retrieveChallengeResponseDtoIfNotInJourneyData'
import checkChallengeDtoExistsInJourneyData from '../middleware/checkChallengeDtoExistsInJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { validate } from '../../../middleware/validationMiddleware'
import deleteReasonSchema from '../validationSchemas/deleteReasonSchema'
import HistoryReasonController from './reason/historyReasonController'
import HistoryReviewController from './review/historyReviewController'
import HistoryConfirmController from './confirm/historyConfirmController'

const historyDeleteChallengeRoutes = (services: Services): Router => {
  const { auditService, challengeService, journeyDataService } = services
  const router = Router({ mergeParams: true })

  const reasonController = new HistoryReasonController(challengeService)
  const reviewController = new HistoryReviewController(challengeService)
  const confirmController = new HistoryConfirmController(challengeService, auditService)

  router.use('/', [
    requireFeatureToggle('sanDataDeletionEnabled'),
    checkUserHasPermissionTo(ApplicationAction.DELETE_CHALLENGES),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }),
  ])
  router.use('/:journeyId', [
    setupJourneyData(journeyDataService),
    retrieveChallengeResponseDtoIfNotInJourneyData(challengeService),
  ])

  router.get('/:journeyId/reason', [
    checkChallengeDtoExistsInJourneyData,
    asyncMiddleware(reasonController.getReasonView),
  ])
  router.post('/:journeyId/reason', [
    checkChallengeDtoExistsInJourneyData,
    validate(deleteReasonSchema({ mode: 'history' })),
    asyncMiddleware(reasonController.submitReasonForm),
  ])

  router.get('/:journeyId/review', [
    checkChallengeDtoExistsInJourneyData,
    asyncMiddleware(reviewController.getReviewView),
  ])
  router.post('/:journeyId/review', [
    checkChallengeDtoExistsInJourneyData,
    asyncMiddleware(reviewController.submitReviewForm),
  ])

  router.get('/:journeyId/confirm', [
    checkChallengeDtoExistsInJourneyData,
    asyncMiddleware(confirmController.getConfirmView),
  ])
  router.post('/:journeyId/confirm', [
    checkChallengeDtoExistsInJourneyData,
    asyncMiddleware(confirmController.submitConfirmForm),
  ])

  return router
}

export default historyDeleteChallengeRoutes
