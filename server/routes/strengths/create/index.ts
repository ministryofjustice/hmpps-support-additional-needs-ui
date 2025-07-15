import { Router } from 'express'
import { Services } from '../../../services'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import SelectCategoryController from './select-category/selectCategoryController'
import DetailController from './detail/detailController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import createEmptyStrengthDtoIfNotInJourneyData from './middleware/createEmptyStrengthDtoIfNotInJourneyData'
import checkStrengthDtoExistsInJourneyData from './middleware/checkStrengthDtoExistsInJourneyData'
import selectCategorySchema from '../validationSchemas/selectCategorySchema'
import { validate } from '../../../middleware/validationMiddleware'

const createStrengthRoutes = (services: Services): Router => {
  const { journeyDataService } = services
  const router = Router({ mergeParams: true })

  const selectCategoryController = new SelectCategoryController()
  const detailController = new DetailController()

  router.use('/', [
    // TODO - enable this line when we understand the RBAC roles and permissions
    // checkUserHasPermissionTo(ApplicationAction.RECORD_STRENGTHS),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/strengths/:prisonNumber/create' - eg: '/strengths/A1234BC/create/473e9ee4-37d6-4afb-92a2-5729b10cc60f/select-category'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/select-category', [
    createEmptyStrengthDtoIfNotInJourneyData,
    asyncMiddleware(selectCategoryController.getSelectCategoryView),
  ])
  router.post('/:journeyId/select-category', [
    checkStrengthDtoExistsInJourneyData,
    validate(selectCategorySchema),
    asyncMiddleware(selectCategoryController.submitSelectCategoryForm),
  ])

  router.get('/:journeyId/detail', [
    checkStrengthDtoExistsInJourneyData,
    asyncMiddleware(detailController.getDetailView),
  ])

  return router
}

export default createStrengthRoutes
