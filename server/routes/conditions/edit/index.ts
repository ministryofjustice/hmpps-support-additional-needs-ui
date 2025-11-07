import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import DetailController from './detail/detailController'
import retrieveConditionDtoIfNotInJourneyData from '../middleware/retrieveConditionDtoIfNotInJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import checkConditionDtoExistsInJourneyData from '../middleware/checkConditionDtoExistsInJourneyData'
import { validate } from '../../../middleware/validationMiddleware'
import editDetailSchema from '../validationSchemas/editDetailSchema'

const editConditionRoutes = (services: Services): Router => {
  const { auditService, conditionService, journeyDataService } = services
  const router = Router({ mergeParams: true })

  const detailController = new DetailController(conditionService, auditService)

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.EDIT_CONDITIONS),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }), // insert journey ID immediately after '/conditions/:prisonNumber/:conditionsReference/edit/detail' - eg: '/conditions/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/edit/473e9ee4-37d6-4afb-92a2-5729b10cc60f/detail'
  ])
  router.use('/:journeyId', [
    setupJourneyData(journeyDataService),
    retrieveConditionDtoIfNotInJourneyData(conditionService),
  ])

  router.get('/:journeyId/detail', [
    checkConditionDtoExistsInJourneyData,
    asyncMiddleware(detailController.getDetailView),
  ])
  router.post('/:journeyId/detail', [
    checkConditionDtoExistsInJourneyData,
    validate(editDetailSchema),
    asyncMiddleware(detailController.submitDetailForm),
  ])

  return router
}

export default editConditionRoutes
