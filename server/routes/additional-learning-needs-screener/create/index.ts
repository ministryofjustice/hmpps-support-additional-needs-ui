import { Request, Response, Router } from 'express'
import { Services } from '../../../services'
import ScreenerDateController from './screener-date/screenerDateController'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import createEmptyAlnScreenerDtoIfNotInJourneyData from './middleware/createEmptyAlnScreenerDtoIfNotInJourneyData'
import checkAlnScreenerDtoExistsInJourneyData from './middleware/checkAlnScreenerDtoExistsInJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { validate } from '../../../middleware/validationMiddleware'
import screenerDateSchema from '../validationSchemas/screenerDateSchema'
import retrieveReferenceData from '../../middleware/retrieveReferenceData'
import ReferenceDataDomain from '../../../enums/referenceDataDomain'
import AddChallengesController from './add-challenges/addChallengesController'

const createAlnRoutes = (services: Services): Router => {
  const { journeyDataService, referenceDataService } = services
  const router = Router({ mergeParams: true })

  const screenerDateController = new ScreenerDateController()
  const addChallengesController = new AddChallengesController()

  router.use('/', [
    // TODO - enable this line when we understand the RBAC roles and permissions
    // checkUserHasPermissionTo(ApplicationAction.RECORD_ALN_SCREENER),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/aln-screener/:prisonNumber/create' - eg: '/aln-screener/A1234BC/create/473e9ee4-37d6-4afb-92a2-5729b10cc60f/screener-date'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/screener-date', [
    createEmptyAlnScreenerDtoIfNotInJourneyData,
    asyncMiddleware(screenerDateController.getScreenerDateView),
  ])
  router.post('/:journeyId/screener-date', [
    checkAlnScreenerDtoExistsInJourneyData,
    validate(screenerDateSchema),
    asyncMiddleware(screenerDateController.submitScreenerDateView),
  ])

  router.get('/:journeyId/add-challenges', [
    checkAlnScreenerDtoExistsInJourneyData,
    retrieveReferenceData(ReferenceDataDomain.CHALLENGE, referenceDataService),
    asyncMiddleware(addChallengesController.getAddChallengesView),
  ])

  router.get('/:journeyId/add-strengths', [
    checkAlnScreenerDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('ALN Screener - Add Strengths page')
    },
  ])

  router.get('/:journeyId/check-your-answers', [
    checkAlnScreenerDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('ALN Screener - Check Your Answers page')
    },
  ])

  return router
}

export default createAlnRoutes
