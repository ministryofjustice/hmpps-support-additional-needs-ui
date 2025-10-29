import { Request, Response, Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'

const editSupportStrategiesRoutes = (services: Services): Router => {
  const { journeyDataService } = services

  const router = Router({ mergeParams: true })

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.EDIT_SUPPORT_STRATEGIES),
    insertJourneyIdentifier({ insertIdAfterElement: 4 }), // insert journey ID immediately after '/support-strategies/:prisonNumber/:supportStrategyReference/edit/detail' - eg: '/support-strategies/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/edit/473e9ee4-37d6-4afb-92a2-5729b10cc60f/detail'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/detail', [
    // TODO - implement retrieveSupportStrategyResponseDtoIfNotInJourneyData,
    // TODO - replace with a controller method
    async (req: Request, res: Response) => {
      res.send('Edit support strategy - detail page')
    },
  ])

  return router
}

export default editSupportStrategiesRoutes
