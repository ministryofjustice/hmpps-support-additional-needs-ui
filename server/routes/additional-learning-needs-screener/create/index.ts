import { Router } from 'express'
import { Services } from '../../../services'
import ScreenerDateController from './screener-date/screenerDateController'
import AddChallengesController from './add-challenges/addChallengesController'
import AddStrengthsController from './add-strengths/addStrengthsController'
import CheckYourAnswersController from './check-your-answers/checkYourAnswersController'
import ReferenceDataDomain from '../../../enums/referenceDataDomain'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import createEmptyAlnScreenerDtoIfNotInJourneyData from './middleware/createEmptyAlnScreenerDtoIfNotInJourneyData'
import checkAlnScreenerDtoExistsInJourneyData from './middleware/checkAlnScreenerDtoExistsInJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { validate } from '../../../middleware/validationMiddleware'
import screenerDateSchema from '../validationSchemas/screenerDateSchema'
import retrieveReferenceData from '../../middleware/retrieveReferenceData'
import addChallengesSchema from '../validationSchemas/addChallengesSchema'
import addStrengthsSchema from '../validationSchemas/addStrengthsSchema'
import checkYourAnswersSchema from '../validationSchemas/checkYourAnswersSchema'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'

const createAlnRoutes = (services: Services): Router => {
  const { additionalLearningNeedsService, journeyDataService, referenceDataService } = services
  const router = Router({ mergeParams: true })

  const screenerDateController = new ScreenerDateController()
  const addChallengesController = new AddChallengesController()
  const addStrengthsController = new AddStrengthsController()
  const checkYourAnswersController = new CheckYourAnswersController(additionalLearningNeedsService)

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_ALN_SCREENER),
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
    asyncMiddleware(screenerDateController.submitScreenerDateForm),
  ])

  router.get('/:journeyId/add-challenges', [
    checkAlnScreenerDtoExistsInJourneyData,
    retrieveReferenceData(ReferenceDataDomain.CHALLENGE, referenceDataService),
    asyncMiddleware(addChallengesController.getAddChallengesView),
  ])
  router.post('/:journeyId/add-challenges', [
    checkAlnScreenerDtoExistsInJourneyData,
    validate(addChallengesSchema),
    asyncMiddleware(addChallengesController.submitAddChallengesForm),
  ])

  router.get('/:journeyId/add-strengths', [
    checkAlnScreenerDtoExistsInJourneyData,
    retrieveReferenceData(ReferenceDataDomain.STRENGTH, referenceDataService),
    asyncMiddleware(addStrengthsController.getAddStrengthsView),
  ])
  router.post('/:journeyId/add-strengths', [
    checkAlnScreenerDtoExistsInJourneyData,
    validate(addStrengthsSchema),
    asyncMiddleware(addStrengthsController.submitAddStrengthsForm),
  ])

  router.get('/:journeyId/check-your-answers', [
    checkAlnScreenerDtoExistsInJourneyData,
    retrieveReferenceData(ReferenceDataDomain.CHALLENGE, referenceDataService),
    retrieveReferenceData(ReferenceDataDomain.STRENGTH, referenceDataService),
    asyncMiddleware(checkYourAnswersController.getCheckYourAnswersView),
  ])
  router.post('/:journeyId/check-your-answers', [
    checkAlnScreenerDtoExistsInJourneyData,
    validate(checkYourAnswersSchema),
    asyncMiddleware(checkYourAnswersController.submitCheckYourAnswersForm),
  ])

  return router
}

export default createAlnRoutes
