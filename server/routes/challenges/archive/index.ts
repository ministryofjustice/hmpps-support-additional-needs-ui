import { Request, Response, Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveChallengeResponseDtoIfNotInJourneyData from '../middleware/retrieveChallengeResponseDtoIfNotInJourneyData'
import checkChallengeDtoExistsInJourneyData from '../middleware/checkChallengeDtoExistsInJourneyData'

const archiveChallengeRoutes = (services: Services): Router => {
  const { journeyDataService, challengeService } = services
  const router = Router({ mergeParams: true })

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
    async (req: Request, res: Response) => {
      res.send('Archive challenge reason')
    },
  ])
  return router
}

export default archiveChallengeRoutes
