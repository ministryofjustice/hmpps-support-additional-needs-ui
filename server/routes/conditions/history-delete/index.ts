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
import HistoryReasonController from './reason/historyReasonController'
import HistoryReviewController from './review/historyReviewController'
import HistoryConfirmController from './confirm/historyConfirmController'

const historyDeleteConditionRoutes = (services: Services): Router => {
  const { auditService, conditionService, journeyDataService } = services
  const router = Router({ mergeParams: true })

  const reasonController = new HistoryReasonController(conditionService)
  const reviewController = new HistoryReviewController(conditionService)
  const confirmController = new HistoryConfirmController(conditionService, auditService)

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
    validate(deleteReasonSchema({ mode: 'history' })),
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

export default historyDeleteConditionRoutes
