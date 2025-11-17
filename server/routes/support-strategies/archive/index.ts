import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveSupportStrategyResponseDtoIfNotInJourneyData from '../middleware/retrieveSupportStrategyResponseDtoIfNotInJourneyData'
import checkSupportStrategyDtoExistsInJourneyData from '../middleware/checkSupportStrategyDtoExistsInJourneyData'
import ReasonController from './reason/reasonController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'
import { validate } from '../../../middleware/validationMiddleware'
import archiveReasonSchema from '../validationSchemas/archiveReasonSchema'

const archiveSupportStrategyRoutes = (services: Services): Router => {
  const { auditService, journeyDataService, prisonService, supportStrategyService } = services
  const router = Router({ mergeParams: true })

  const reasonController = new ReasonController(supportStrategyService, auditService)

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.ARCHIVE_SUPPORT_STRATEGIES),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }), // insert journey ID immediately after '/support-strategies/:prisonNumber/:supportStrategyReference/archive/reason' - eg: '/support-strategies/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/archive/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason'
  ])
  router.use('/:journeyId', [
    setupJourneyData(journeyDataService),
    retrieveSupportStrategyResponseDtoIfNotInJourneyData(supportStrategyService),
  ])

  router.get('/:journeyId/reason', [
    checkSupportStrategyDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    asyncMiddleware(reasonController.getReasonView),
  ])
  router.post('/:journeyId/reason', [
    checkSupportStrategyDtoExistsInJourneyData,
    validate(archiveReasonSchema),
    asyncMiddleware(reasonController.submitReasonForm),
  ])

  return router
}

export default archiveSupportStrategyRoutes
