import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import requireFeatureToggle from '../../../middleware/requireFeatureToggle'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import loadLatestScreenerIntoJourneyData from './middleware/loadLatestScreenerIntoJourneyData'
import checkScreenerDeletionDtoExistsInJourneyData from './middleware/checkScreenerDeletionDtoExistsInJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { validate } from '../../../middleware/validationMiddleware'
import deleteReasonSchema from '../validationSchemas/deleteReasonSchema'
import ReasonController from './reason/reasonController'
import ReviewController from './review/reviewController'
import ConfirmController from './confirm/confirmController'

const deleteAlnScreenerRoutes = (services: Services): Router => {
  const { auditService, additionalLearningNeedsService, journeyDataService } = services
  const router = Router({ mergeParams: true })

  const reasonController = new ReasonController()
  const reviewController = new ReviewController()
  const confirmController = new ConfirmController(additionalLearningNeedsService, auditService)

  router.use('/', [
    requireFeatureToggle('sanDataDeletionEnabled'),
    checkUserHasPermissionTo(ApplicationAction.DELETE_ALN_SCREENER),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }),
  ])
  router.use('/:journeyId', [
    setupJourneyData(journeyDataService),
    loadLatestScreenerIntoJourneyData(additionalLearningNeedsService),
  ])

  router.get('/:journeyId/reason', [
    checkScreenerDeletionDtoExistsInJourneyData,
    asyncMiddleware(reasonController.getReasonView),
  ])
  router.post('/:journeyId/reason', [
    checkScreenerDeletionDtoExistsInJourneyData,
    validate(deleteReasonSchema()),
    asyncMiddleware(reasonController.submitReasonForm),
  ])

  router.get('/:journeyId/review', [
    checkScreenerDeletionDtoExistsInJourneyData,
    asyncMiddleware(reviewController.getReviewView),
  ])
  router.post('/:journeyId/review', [
    checkScreenerDeletionDtoExistsInJourneyData,
    asyncMiddleware(reviewController.submitReviewForm),
  ])

  router.get('/:journeyId/confirm', [
    checkScreenerDeletionDtoExistsInJourneyData,
    asyncMiddleware(confirmController.getConfirmView),
  ])
  router.post('/:journeyId/confirm', [
    checkScreenerDeletionDtoExistsInJourneyData,
    asyncMiddleware(confirmController.submitConfirmForm),
  ])

  return router
}

export default deleteAlnScreenerRoutes
