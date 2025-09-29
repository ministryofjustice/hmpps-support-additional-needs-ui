import { Router } from 'express'
import { Services } from '../../../services'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { validate } from '../../../middleware/validationMiddleware'
import createEmptyRefuseEducationSupportPlanDtoIfNotInJourneyData from './middleware/createEmptyRefuseEducationSupportPlanDtoIfNotInJourneyData'
import checkRefuseEducationSupportPlanDtoExistsInJourneyData from './middleware/checkRefuseEducationSupportPlanDtoExistsInJourneyData'
import reasonSchema from './validationSchemas/reasonSchema'
import ReasonController from './reason/reasonController'
import ApplicationAction from '../../../enums/applicationAction'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'

const refuseEducationSupportPlanRoutes = (services: Services): Router => {
  const { auditService, educationSupportPlanScheduleService, journeyDataService } = services
  const router = Router({ mergeParams: true })

  const reasonController = new ReasonController(educationSupportPlanScheduleService, auditService)

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.RECORD_DECLINED_EDUCATION_LEARNER_SUPPORT_PLAN),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/education-support-plan/:prisonNumber/refuse-plan' - eg: '/education-support-plan/A1234BC/refuse-plan/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/reason', [
    createEmptyRefuseEducationSupportPlanDtoIfNotInJourneyData,
    asyncMiddleware(reasonController.getRefusePlanReasonView),
  ])
  router.post('/:journeyId/reason', [
    checkRefuseEducationSupportPlanDtoExistsInJourneyData,
    validate(reasonSchema),
    asyncMiddleware(reasonController.submitRefusePlanReasonView),
  ])

  return router
}

export default refuseEducationSupportPlanRoutes
