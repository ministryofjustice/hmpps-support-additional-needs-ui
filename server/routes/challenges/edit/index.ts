import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveChallengeResponseDtoIfNotInJourneyData from '../middleware/retrieveChallengeResponseDtoIfNotInJourneyData'
import DetailController from './detail/detailController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import checkChallengeDtoExistsInJourneyData from '../middleware/checkChallengeDtoExistsInJourneyData'
import { validate } from '../../../middleware/validationMiddleware'
import detailSchema from '../validationSchemas/detailSchema'

const editChallengesRoutes = (services: Services): Router => {
  const { auditService, challengeService, journeyDataService } = services
  const router = Router({ mergeParams: true })

  const detailController = new DetailController(challengeService, auditService)

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.EDIT_CHALLENGES),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }), // insert journey ID immediately after '/challenges/:prisonNumber/:challengeReference/edit/detail' - eg: '/challenges/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/edit/473e9ee4-37d6-4afb-92a2-5729b10cc60f/detail'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/detail', [
    retrieveChallengeResponseDtoIfNotInJourneyData(challengeService),
    asyncMiddleware(detailController.getDetailView),
  ])
  router.post('/:journeyId/detail', [
    checkChallengeDtoExistsInJourneyData,
    validate(detailSchema),
    asyncMiddleware(detailController.submitDetailForm),
  ])

  return router
}

export default editChallengesRoutes
