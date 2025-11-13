import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveConditionDtoIfNotInJourneyData from '../middleware/retrieveConditionDtoIfNotInJourneyData'
import checkConditionDtoExistsInJourneyData from '../middleware/checkConditionDtoExistsInJourneyData'
import ReasonController from './reason/reasonController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'
import { validate } from '../../../middleware/validationMiddleware'
import archiveReasonSchema from '../validationSchemas/archiveReasonSchema'

const archiveConditionRoutes = (services: Services): Router => {
  const { auditService, conditionService, journeyDataService, prisonService } = services
  const router = Router({ mergeParams: true })

  const reasonController = new ReasonController(conditionService, auditService)

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.ARCHIVE_CONDITIONS),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }), // insert journey ID immediately after '/conditions/:prisonNumber/:conditionReference/archive/reason' - eg: '/conditions/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/archive/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason'
  ])
  router.use('/:journeyId', [
    setupJourneyData(journeyDataService),
    retrieveConditionDtoIfNotInJourneyData(conditionService),
  ])

  router.get('/:journeyId/reason', [
    checkConditionDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    asyncMiddleware(reasonController.getReasonView),
  ])
  router.post('/:journeyId/reason', [
    checkConditionDtoExistsInJourneyData,
    validate(archiveReasonSchema),
    asyncMiddleware(reasonController.submitReasonForm),
  ])

  return router
}

export default archiveConditionRoutes
