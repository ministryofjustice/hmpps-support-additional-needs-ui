import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveChallengeResponseDtoIfNotInJourneyData from '../middleware/retrieveChallengeResponseDtoIfNotInJourneyData'
import checkChallengeDtoExistsInJourneyData from '../middleware/checkChallengeDtoExistsInJourneyData'
import ReasonController from './reason/reasonController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import archiveReasonSchema from '../validationSchemas/archiveReasonSchema'
import { validate } from '../../../middleware/validationMiddleware'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'

const archiveChallengeRoutes = (services: Services): Router => {
  const { auditService, challengeService, journeyDataService, prisonService } = services
  const router = Router({ mergeParams: true })

  const reasonController = new ReasonController(challengeService, auditService)

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.ARCHIVE_CHALLENGES),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }), // insert journey ID immediately after '/challenges/:prisonNumber/:challengeReference/archive/reason' - eg: '/challenges/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/archive/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason'
  ])
  router.use('/:journeyId', [
    setupJourneyData(journeyDataService),
    retrieveChallengeResponseDtoIfNotInJourneyData(challengeService),
  ])

  router.get('/:journeyId/reason', [
    checkChallengeDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    asyncMiddleware(reasonController.getReasonView),
  ])
  router.post('/:journeyId/reason', [
    checkChallengeDtoExistsInJourneyData,
    validate(archiveReasonSchema),
    asyncMiddleware(reasonController.submitReasonForm),
  ])

  return router
}

export default archiveChallengeRoutes
