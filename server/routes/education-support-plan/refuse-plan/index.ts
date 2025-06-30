import { Router } from 'express'
import { Services } from '../../../services'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import { validate } from '../../../middleware/validationMiddleware'
import reasonSchema from '../validationSchemas/refuse-plan/reasonSchema'
import ReasonController from './reason/reasonController'

const refuseEducationSupportPlanRoutes = (services: Services): Router => {
  const { journeyDataService } = services
  const router = Router({ mergeParams: true })

  const reasonController = new ReasonController()

  router.use('/', [
    // TODO - enable this line when we understand the RBAC roles and permissions
    // checkUserHasPermissionTo(ApplicationAction.EXEMPT_EDUCATION_LEARNER_SUPPORT_PLAN),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/education-support-plan/:prisonNumber/refuse-plan' - eg: '/education-support-plan/A1234BC/refuse-plan/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/reason', [
    // createEmptyEducationSupportPlanDtoIfNotInJourneyData,
    asyncMiddleware(reasonController.getRefusePlanReasonView),
  ])
  router.post('/:journeyId/reason', [
    // checkEducationSupportPlanDtoExistsInJourneyData,
    validate(reasonSchema),
    asyncMiddleware(reasonController.submitRefusePlanReasonView),
  ])

  return router
}

export default refuseEducationSupportPlanRoutes
