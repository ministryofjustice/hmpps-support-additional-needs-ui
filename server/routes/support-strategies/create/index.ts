import { Request, Response, Router } from 'express'
import { Services } from '../../../services'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import createEmptySupportStrategyDtoIfNotInJourneyData from './middleware/createEmptySupportStrategyDtoIfNotInJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import SelectCategoryController from './select-category/selectCategoryController'

const createSupportStrategiesRoutes = (services: Services): Router => {
  const { journeyDataService } = services
  const router = Router({ mergeParams: true })

  const selectCategoryController = new SelectCategoryController()

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_SUPPORT_STRATEGIES),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/support-strategies/:prisonNumber/create' - eg: '/support-strategies/A1234BC/create/473e9ee4-37d6-4afb-92a2-5729b10cc60f/select-category'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/select-category', [
    createEmptySupportStrategyDtoIfNotInJourneyData,
    asyncMiddleware(selectCategoryController.getSelectCategoryView),
  ])

  router.get('/:journeyId/detail', [
    async (req: Request, res: Response) => {
      res.send('Support Strategies - Details page')
    },
  ])

  return router
}

export default createSupportStrategiesRoutes
