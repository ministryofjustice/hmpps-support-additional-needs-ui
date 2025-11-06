import { Request, Response, Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveSupportStrategyResponseDtoIfNotInJourneyData from '../middleware/retrieveSupportStrategyResponseDtoIfNotInJourneyData'
import checkSupportStrategyDtoExistsInJourneyData from '../middleware/checkSupportStrategyDtoExistsInJourneyData'

const archiveSupportStrategyRoutes = (services: Services): Router => {
  const { journeyDataService, supportStrategyService } = services
  const router = Router({ mergeParams: true })

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
    async (req: Request, res: Response) => {
      res.send('Archive support strategy reason')
    },
  ])
  return router
}

export default archiveSupportStrategyRoutes
