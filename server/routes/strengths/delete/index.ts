import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import requireFeatureToggle from '../../../middleware/requireFeatureToggle'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveStrengthResponseDtoIfNotInJourneyData from '../middleware/retrieveStrengthResponseDtoIfNotInJourneyData'
import checkStrengthDtoExistsInJourneyData from '../middleware/checkStrengthDtoExistsInJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { validate } from '../../../middleware/validationMiddleware'
import deleteReasonSchema from '../validationSchemas/deleteReasonSchema'
import ReasonController from './reason/reasonController'
import ReviewController from './review/reviewController'
import ConfirmController from './confirm/confirmController'

const deleteStrengthRoutes = (services: Services): Router => {
  const { auditService, strengthService, journeyDataService } = services
  const router = Router({ mergeParams: true })

  const reasonController = new ReasonController(strengthService)
  const reviewController = new ReviewController(strengthService)
  const confirmController = new ConfirmController(strengthService, auditService)

  router.use('/', [
    requireFeatureToggle('sanDataDeletionEnabled'),
    checkUserHasPermissionTo(ApplicationAction.DELETE_STRENGTHS),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }),
  ])
  router.use('/:journeyId', [
    setupJourneyData(journeyDataService),
    retrieveStrengthResponseDtoIfNotInJourneyData(strengthService),
  ])

  router.get('/:journeyId/reason', [
    checkStrengthDtoExistsInJourneyData,
    asyncMiddleware(reasonController.getReasonView),
  ])
  router.post('/:journeyId/reason', [
    checkStrengthDtoExistsInJourneyData,
    validate(deleteReasonSchema({ mode: 'active' })),
    asyncMiddleware(reasonController.submitReasonForm),
  ])

  router.get('/:journeyId/review', [
    checkStrengthDtoExistsInJourneyData,
    asyncMiddleware(reviewController.getReviewView),
  ])
  router.post('/:journeyId/review', [
    checkStrengthDtoExistsInJourneyData,
    asyncMiddleware(reviewController.submitReviewForm),
  ])

  router.get('/:journeyId/confirm', [
    checkStrengthDtoExistsInJourneyData,
    asyncMiddleware(confirmController.getConfirmView),
  ])
  router.post('/:journeyId/confirm', [
    checkStrengthDtoExistsInJourneyData,
    asyncMiddleware(confirmController.submitConfirmForm),
  ])

  return router
}

export default deleteStrengthRoutes
