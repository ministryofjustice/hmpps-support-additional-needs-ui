import { Request, Response, Router } from 'express'
import { Services } from '../../../services'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'

const createAlnRoutes = (services: Services): Router => {
  const { journeyDataService } = services
  const router = Router({ mergeParams: true })

  router.use('/', [
    // TODO - enable this line when we understand the RBAC roles and permissions
    // checkUserHasPermissionTo(ApplicationAction.RECORD_ALN_SCREENER),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/aln-screener/:prisonNumber/create' - eg: '/aln-screener/A1234BC/create/473e9ee4-37d6-4afb-92a2-5729b10cc60f/screener-date'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/screener-date', [
    async (req: Request, res: Response) => {
      res.send('ALN Screener - Add Date page')
    },
  ])

  router.get('/:journeyId/add-challenges', [
    async (req: Request, res: Response) => {
      res.send('ALN Screener - Add Challenges page')
    },
  ])

  router.get('/:journeyId/add-strengths', [
    async (req: Request, res: Response) => {
      res.send('ALN Screener - Add Strengths page')
    },
  ])

  router.get('/:journeyId/check-your-answers', [
    async (req: Request, res: Response) => {
      res.send('ALN Screener - Check Your Answers page')
    },
  ])

  return router
}

export default createAlnRoutes
