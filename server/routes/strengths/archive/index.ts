import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveStrengthResponseDtoIfNotInJourneyData from '../middleware/retrieveStrengthResponseDtoIfNotInJourneyData'
import checkStrengthDtoExistsInJourneyData from '../middleware/checkStrengthDtoExistsInJourneyData'
import ReasonController from './reason/reasonController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import archiveReasonSchema from '../validationSchemas/archiveReasonSchema'
import { validate } from '../../../middleware/validationMiddleware'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'

const archiveStrengthRoutes = (services: Services): Router => {
  const { auditService, journeyDataService, prisonService, strengthService } = services
  const router = Router({ mergeParams: true })

  const reasonController = new ReasonController(strengthService, auditService)

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.ARCHIVE_STRENGTHS),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }), // insert journey ID immediately after '/strengths/:prisonNumber/:strengthReference/archive/reason' - eg: '/strengths/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/archive/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason'
  ])
  router.use('/:journeyId', [
    setupJourneyData(journeyDataService),
    retrieveStrengthResponseDtoIfNotInJourneyData(strengthService),
  ])

  router.get('/:journeyId/reason', [
    checkStrengthDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    asyncMiddleware(reasonController.getReasonView),
  ])
  router.post('/:journeyId/reason', [
    checkStrengthDtoExistsInJourneyData,
    validate(archiveReasonSchema),
    asyncMiddleware(reasonController.submitReasonForm),
  ])

  return router
}

export default archiveStrengthRoutes
