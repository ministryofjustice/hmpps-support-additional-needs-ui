import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import requireFeatureToggle from '../../../middleware/requireFeatureToggle'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveSupportStrategyResponseDtoIfNotInJourneyData from '../middleware/retrieveSupportStrategyResponseDtoIfNotInJourneyData'
import checkSupportStrategyDtoExistsInJourneyData from '../middleware/checkSupportStrategyDtoExistsInJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { validate } from '../../../middleware/validationMiddleware'
import deleteReasonSchema from '../validationSchemas/deleteReasonSchema'
import ReasonController from './reason/reasonController'
import ReviewController from './review/reviewController'
import ConfirmController from './confirm/confirmController'

const deleteSupportStrategyRoutes = (services: Services): Router => {
  const { auditService, supportStrategyService, journeyDataService } = services
  const router = Router({ mergeParams: true })

  const reasonController = new ReasonController(supportStrategyService)
  const reviewController = new ReviewController(supportStrategyService)
  const confirmController = new ConfirmController(supportStrategyService, auditService)

  router.use('/', [
    requireFeatureToggle('sanDataDeletionEnabled'),
    checkUserHasPermissionTo(ApplicationAction.DELETE_SUPPORT_STRATEGIES),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }),
  ])
  router.use('/:journeyId', [
    setupJourneyData(journeyDataService),
    retrieveSupportStrategyResponseDtoIfNotInJourneyData(supportStrategyService),
  ])

  router.get('/:journeyId/reason', [
    checkSupportStrategyDtoExistsInJourneyData,
    asyncMiddleware(reasonController.getReasonView),
  ])
  router.post('/:journeyId/reason', [
    checkSupportStrategyDtoExistsInJourneyData,
    validate(deleteReasonSchema({ mode: 'active' })),
    asyncMiddleware(reasonController.submitReasonForm),
  ])

  router.get('/:journeyId/review', [
    checkSupportStrategyDtoExistsInJourneyData,
    asyncMiddleware(reviewController.getReviewView),
  ])
  router.post('/:journeyId/review', [
    checkSupportStrategyDtoExistsInJourneyData,
    asyncMiddleware(reviewController.submitReviewForm),
  ])

  router.get('/:journeyId/confirm', [
    checkSupportStrategyDtoExistsInJourneyData,
    asyncMiddleware(confirmController.getConfirmView),
  ])
  router.post('/:journeyId/confirm', [
    checkSupportStrategyDtoExistsInJourneyData,
    asyncMiddleware(confirmController.submitConfirmForm),
  ])

  return router
}

export default deleteSupportStrategyRoutes
