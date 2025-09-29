import { Router } from 'express'
import { Services } from '../../../services'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import createEmptySupportStrategyDtoIfNotInJourneyData from './middleware/createEmptySupportStrategyDtoIfNotInJourneyData'
import checkSupportStrategyDtoExistsInJourneyData from './middleware/checkSupportStrategyDtoExistsInJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import SelectCategoryController from './select-category/selectCategoryController'
import { validate } from '../../../middleware/validationMiddleware'
import selectCategorySchema from '../validationSchemas/selectCategorySchema'
import DetailController from './detail/detailController'
import detailSchema from '../validationSchemas/detailSchema'

const createSupportStrategiesRoutes = (services: Services): Router => {
  const { auditService, journeyDataService, supportStrategyService } = services
  const router = Router({ mergeParams: true })

  const selectCategoryController = new SelectCategoryController()
  const detailController = new DetailController(supportStrategyService, auditService)

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_SUPPORT_STRATEGIES),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/support-strategies/:prisonNumber/create' - eg: '/support-strategies/A1234BC/create/473e9ee4-37d6-4afb-92a2-5729b10cc60f/select-category'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/select-category', [
    createEmptySupportStrategyDtoIfNotInJourneyData,
    asyncMiddleware(selectCategoryController.getSelectCategoryView),
  ])
  router.post('/:journeyId/select-category', [
    checkSupportStrategyDtoExistsInJourneyData,
    validate(selectCategorySchema),
    asyncMiddleware(selectCategoryController.submitSelectCategoryForm),
  ])

  router.get('/:journeyId/detail', [
    checkSupportStrategyDtoExistsInJourneyData,
    asyncMiddleware(detailController.getDetailView),
  ])
  router.post('/:journeyId/detail', [
    checkSupportStrategyDtoExistsInJourneyData,
    validate(detailSchema),
    asyncMiddleware(detailController.submitDetailForm),
  ])

  return router
}

export default createSupportStrategiesRoutes
