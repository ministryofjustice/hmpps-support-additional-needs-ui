import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import DetailController from './detail/detailController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { validate } from '../../../middleware/validationMiddleware'
import detailSchema from '../validationSchemas/detailSchema'
import retrieveStrengthResponseDtoIfNotInJourneyData from '../middleware/retrieveStrengthResponseDtoIfNotInJourneyData'
import checkStrengthDtoExistsInJourneyData from '../middleware/checkStrengthDtoExistsInJourneyData'

const editStrengthRoutes = (services: Services): Router => {
  const { auditService, journeyDataService, strengthService } = services
  const router = Router({ mergeParams: true })

  const detailController = new DetailController(strengthService, auditService)

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.EDIT_STRENGTHS),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }), // insert journey ID immediately after '/strengths/:prisonNumber/:strengthReference/edit/detail' - eg: '/strengths/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/edit/473e9ee4-37d6-4afb-92a2-5729b10cc60f/detail'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/detail', [
    retrieveStrengthResponseDtoIfNotInJourneyData(strengthService),
    asyncMiddleware(detailController.getDetailView),
  ])
  router.post('/:journeyId/detail', [
    checkStrengthDtoExistsInJourneyData,
    validate(detailSchema),
    asyncMiddleware(detailController.submitDetailForm),
  ])

  return router
}

export default editStrengthRoutes
