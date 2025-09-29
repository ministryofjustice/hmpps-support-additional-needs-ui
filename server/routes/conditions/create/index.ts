import { Router } from 'express'
import { Services } from '../../../services'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import SelectConditionsController from './select-conditions/selectConditionsController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import createEmptyConditionsListIfNotInJourneyData from './middleware/createEmptyConditionsListIfNotInJourneyData'
import checkConditionsListExistsInJourneyData from './middleware/checkConditionsListExistsInJourneyData'
import { validate } from '../../../middleware/validationMiddleware'
import selectConditionsSchema from '../validationSchemas/selectConditionsSchema'
import DetailsController from './details/detailsController'
import detailsSchema from '../validationSchemas/detailsSchema'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'

const createConditionsRoutes = (services: Services): Router => {
  const { auditService, conditionService, journeyDataService } = services
  const router = Router({ mergeParams: true })

  const selectConditionsController = new SelectConditionsController()
  const detailsController = new DetailsController(conditionService, auditService)

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_SELF_DECLARED_CONDITIONS),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/conditions/:prisonNumber/create' - eg: '/conditions/A1234BC/create/473e9ee4-37d6-4afb-92a2-5729b10cc60f/select-conditions'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/select-conditions', [
    createEmptyConditionsListIfNotInJourneyData,
    asyncMiddleware(selectConditionsController.getSelectConditionsView),
  ])
  router.post('/:journeyId/select-conditions', [
    checkConditionsListExistsInJourneyData,
    validate(selectConditionsSchema),
    asyncMiddleware(selectConditionsController.submitSelectConditionsForm),
  ])

  router.get('/:journeyId/details', [
    checkConditionsListExistsInJourneyData,
    asyncMiddleware(detailsController.getDetailsView),
  ])
  router.post('/:journeyId/details', [
    checkConditionsListExistsInJourneyData,
    validate(detailsSchema),
    asyncMiddleware(detailsController.submitDetailsForm),
  ])

  return router
}

export default createConditionsRoutes
