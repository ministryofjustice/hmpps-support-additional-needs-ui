import { Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import retrieveEducationSupportPlan from '../review/middleware/retrieveEducationSupportPlan'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import checkEducationSupportPlanDtoExistsInJourneyData from '../middleware/checkEducationSupportPlanDtoExistsInJourneyData'
import { validate } from '../../../middleware/validationMiddleware'
import educationHealthCarePlanSchema from '../validationSchemas/educationHealthCarePlanSchema'
import EducationHealthCarePlanController from './education-health-care-plan/educationHealthCarePlanController'

const updateEducationSupportPlanRoutes = (services: Services): Router => {
  const { auditService, educationSupportPlanService, journeyDataService } = services

  const educationHealthCarePlanController = new EducationHealthCarePlanController(auditService)

  const router = Router({ mergeParams: true })

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.UPDATE_EDUCATION_LEARNER_SUPPORT_PLAN),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/education-support-plan/:prisonNumber/update' - eg: '/education-support-plan/A1234BC/update/473e9ee4-37d6-4afb-92a2-5729b10cc60f/education-health-care-plan'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/education-health-care-plan', [
    retrieveEducationSupportPlan(educationSupportPlanService),
    asyncMiddleware(educationHealthCarePlanController.getEhcpView),
  ])
  router.post('/:journeyId/education-health-care-plan', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(educationHealthCarePlanSchema),
    asyncMiddleware(educationHealthCarePlanController.submitEhcpForm),
  ])

  return router
}

export default updateEducationSupportPlanRoutes
