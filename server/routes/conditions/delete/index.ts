import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import requireFeatureToggle from '../../../middleware/requireFeatureToggle'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveConditionDtoIfNotInJourneyData from '../middleware/retrieveConditionDtoIfNotInJourneyData'
import checkConditionDtoExistsInJourneyData from '../middleware/checkConditionDtoExistsInJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { validate } from '../../../middleware/validationMiddleware'
import deleteReasonSchema from '../validationSchemas/deleteReasonSchema'
import ReasonController from './reason/reasonController'
import ReviewController from './review/reviewController'
import ConfirmController from './confirm/confirmController'

const deleteConditionRoutes = (services: Services): Router => {
  const { auditService, conditionService, journeyDataService } = services
  const router = Router({ mergeParams: true })

  const reasonController = new ReasonController(conditionService)
  const reviewController = new ReviewController(conditionService)
  const confirmController = new ConfirmController(conditionService, auditService)

  router.use('/', [
    requireFeatureToggle('sanDataDeletionEnabled'),
    checkUserHasPermissionTo(ApplicationAction.DELETE_CONDITIONS),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }),
  ])
  router.use('/:journeyId', [
    setupJourneyData(journeyDataService),
    retrieveConditionDtoIfNotInJourneyData(conditionService),
  ])

  router.get('/:journeyId/reason', [
    checkConditionDtoExistsInJourneyData,
    asyncMiddleware(reasonController.getReasonView),
  ])
  router.post('/:journeyId/reason', [
    checkConditionDtoExistsInJourneyData,
    validate(deleteReasonSchema({ mode: 'active' })),
    asyncMiddleware(reasonController.submitReasonForm),
  ])

  router.get('/:journeyId/review', [
    checkConditionDtoExistsInJourneyData,
    asyncMiddleware(reviewController.getReviewView),
  ])
  router.post('/:journeyId/review', [
    checkConditionDtoExistsInJourneyData,
    asyncMiddleware(reviewController.submitReviewForm),
  ])

  router.get('/:journeyId/confirm', [
    checkConditionDtoExistsInJourneyData,
    asyncMiddleware(confirmController.getConfirmView),
  ])
  router.post('/:journeyId/confirm', [
    checkConditionDtoExistsInJourneyData,
    asyncMiddleware(confirmController.submitConfirmForm),
  ])

  return router
}

export default deleteConditionRoutes
