import { Router } from 'express'
import { Services } from '../../../services'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import SelectCategoryController from './select-category/selectCategoryController'
import DetailController from './detail/detailController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import createEmptyStrengthDtoIfNotInJourneyData from '../middleware/createEmptyStrengthDtoIfNotInJourneyData'
import checkStrengthDtoExistsInJourneyData from '../middleware/checkStrengthDtoExistsInJourneyData'
import selectCategorySchema from '../validationSchemas/selectCategorySchema'
import detailSchema from '../validationSchemas/detailSchema'
import { validate } from '../../../middleware/validationMiddleware'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'

const createStrengthRoutes = (services: Services): Router => {
  const { auditService, journeyDataService, strengthService } = services
  const router = Router({ mergeParams: true })

  const selectCategoryController = new SelectCategoryController()
  const detailController = new DetailController(strengthService, auditService)

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_STRENGTHS),
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
  router.post('/:journeyId/detail', [
    checkStrengthDtoExistsInJourneyData,
    validate(detailSchema),
    asyncMiddleware(detailController.submitDetailForm),
  ])

  return router
}

export default createStrengthRoutes
