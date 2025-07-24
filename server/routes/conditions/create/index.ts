import { Request, Response, Router } from 'express'
import { Services } from '../../../services'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import SelectConditionsController from './select-conditions/selectConditionsController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'

const createConditionsRoutes = (services: Services): Router => {
  const { journeyDataService } = services
  const router = Router({ mergeParams: true })

  const selectConditionsController = new SelectConditionsController()

  router.use('/', [
    // TODO - enable this line when we understand the RBAC roles and permissions
    // checkUserHasPermissionTo(ApplicationAction.RECORD_CONDITIONS),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/conditions/:prisonNumber/create' - eg: '/conditions/A1234BC/create/473e9ee4-37d6-4afb-92a2-5729b10cc60f/select-conditions'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/select-conditions', [asyncMiddleware(selectConditionsController.getSelectConditionsView)])

  router.get('/:journeyId/details', [
    async (req: Request, res: Response) => {
      res.send('Add Conditions - enter conditions details page')
    },
  ])

  return router
}

export default createConditionsRoutes
