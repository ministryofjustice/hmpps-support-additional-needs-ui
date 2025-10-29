import { Request, Response, Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveChallengeResponseDtoIfNotInJourneyData from '../middleware/retrieveChallengeResponseDtoIfNotInJourneyData'

const editChallengesRoutes = (services: Services): Router => {
  const { challengeService, journeyDataService } = services
  const router = Router({ mergeParams: true })

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.EDIT_CHALLENGES),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }), // insert journey ID immediately after '/challenges/:prisonNumber/:challengeReference/edit/detail' - eg: '/challenges/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/edit/473e9ee4-37d6-4afb-92a2-5729b10cc60f/detail'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/detail', [
    retrieveChallengeResponseDtoIfNotInJourneyData(challengeService),
    // TODO - replace with a controller method
    async (req: Request, res: Response) => {
      res.send('Edit challenge - detail page')
    },
  ])

  return router
}

export default editChallengesRoutes
