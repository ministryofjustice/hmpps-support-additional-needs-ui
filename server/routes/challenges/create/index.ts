import { Router } from 'express'
import { Services } from '../../../services'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import SelectCategoryController from './select-category/selectCategoryController'
import createEmptyChallengeDtoIfNotInJourneyData from './middleware/createEmptyChallengeDtoIfNotInJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import checkChallengeDtoExistsInJourneyData from './middleware/checkChallengeDtoExistsInJourneyData'
import DetailController from './detail/detailController'
import { validate } from '../../../middleware/validationMiddleware'
import selectCategorySchema from '../validationSchemas/selectCategorySchema'
import detailSchema from '../validationSchemas/detailSchema'

const createChallengeRoutes = (services: Services): Router => {
  const { journeyDataService } = services
  const router = Router({ mergeParams: true })

  const selectCategoryController = new SelectCategoryController()
  const detailController = new DetailController(services.challengeService)

  router.use('/', [
    // TODO - enable this line when we understand the RBAC roles and permissions
    // checkUserHasPermissionTo(ApplicationAction.RECORD_CHALLENGES),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/challenges/:prisonNumber/create' - eg: '/challenges/A1234BC/create/473e9ee4-37d6-4afb-92a2-5729b10cc60f/select-category'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/select-category', [
    createEmptyChallengeDtoIfNotInJourneyData,
    asyncMiddleware(selectCategoryController.getSelectCategoryView),
  ])

  router.post('/:journeyId/select-category', [
    checkChallengeDtoExistsInJourneyData,
    validate(selectCategorySchema),
    asyncMiddleware(selectCategoryController.submitSelectCategoryForm),
  ])

  router.get('/:journeyId/detail', [
    checkChallengeDtoExistsInJourneyData,
    asyncMiddleware(detailController.getDetailView),
  ])

  router.post('/:journeyId/detail', [
    checkChallengeDtoExistsInJourneyData,
    validate(detailSchema),
    asyncMiddleware(detailController.submitDetailForm),
  ])

  return router
}

export default createChallengeRoutes
