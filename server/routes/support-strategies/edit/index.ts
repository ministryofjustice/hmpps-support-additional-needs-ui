import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveSupportStrategyResponseDtoIfNotInJourneyData from '../middleware/retrieveSupportStrategyResponseDtoIfNotInJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import checkSupportStrategyDtoExistsInJourneyData from '../middleware/checkSupportStrategyDtoExistsInJourneyData'
import { validate } from '../../../middleware/validationMiddleware'
import DetailController from './detail/detailController'
import detailSchema from '../validationSchemas/detailSchema'

const editSupportStrategiesRoutes = (services: Services): Router => {
  const { auditService, journeyDataService, supportStrategyService } = services
  const router = Router({ mergeParams: true })

  const detailController = new DetailController(supportStrategyService, auditService)

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.EDIT_SUPPORT_STRATEGIES),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }), // insert journey ID immediately after '/support-strategies/:prisonNumber/:supportStrategyReference/edit/detail' - eg: '/support-strategies/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/edit/473e9ee4-37d6-4afb-92a2-5729b10cc60f/detail'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/detail', [
    retrieveSupportStrategyResponseDtoIfNotInJourneyData(supportStrategyService),
    asyncMiddleware(detailController.getDetailView),
  ])
  router.post('/:journeyId/detail', [
    checkSupportStrategyDtoExistsInJourneyData,
    validate(detailSchema),
    asyncMiddleware(detailController.submitDetailForm),
  ])

  return router
}

export default editSupportStrategiesRoutes
