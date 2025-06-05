import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../../../services'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import WhoCreatedThePlanController from './who-created-the-plan/whoCreatedThePlanController'
import OtherPeopleConsultedController from './other-people-consulted/otherPeopleConsultedController'
import ReviewNeedsConditionsStrengthsController from './review-needs-conditions-strengths/reviewNeedsConditionsStrengthsController'
import LearningEnvironmentAdjustmentsController from './learning-environment-adjustments/learningEnvironmentAdjustmentsController'
import TeachingAdjustmentsController from './teaching-adjustments/teachingAdjustmentsController'
import SpecificTeachingSkillsController from './specific-teaching-skills/specificTeachingSkillsController'
import ExamArrangementsController from './exam-arrangements/examArrangementsController'
import { validate } from '../../../middleware/validationMiddleware'
import whoCompletedThePlanSchema from '../validationSchemas/whoCompletedThePlanSchema'
import learningEnvironmentAdjustmentsSchema from '../validationSchemas/learningEnvironmentAdjustmentsSchema'
import teachingAdjustmentsSchema from '../validationSchemas/teachingAdjustmentsSchema'
import specificTeachingSkillsSchema from '../validationSchemas/specificTeachingSkillsSchema'
import examArrangementsSchema from '../validationSchemas/examArrangementsSchema'

const createEducationSupportPlanRoutes = (services: Services): Router => {
  const { journeyDataService } = services
  const router = Router({ mergeParams: true })

  const whoCreatedThePlanController = new WhoCreatedThePlanController()
  const otherPeopleConsultedController = new OtherPeopleConsultedController()
  const reviewNeedsConditionsStrengthsController = new ReviewNeedsConditionsStrengthsController()
  const learningEnvironmentAdjustmentsController = new LearningEnvironmentAdjustmentsController()
  const teachingAdjustmentsController = new TeachingAdjustmentsController()
  const specificTeachingSkillsController = new SpecificTeachingSkillsController()
  const examArrangementsController = new ExamArrangementsController()

  router.use('/', [
    // TODO - enable this line when we understand the RBAC roles and permissions
    // checkUserHasPermissionTo(ApplicationAction.RECORD_EDUCATION_LEARNER_SUPPORT_PLAN),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/education-support-plan/:prisonNumber/create' - eg: '/education-support-plan/A1234BC/create/473e9ee4-37d6-4afb-92a2-5729b10cc60f/who-created-the-plan'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/who-created-the-plan', [
    asyncMiddleware(whoCreatedThePlanController.getWhoCreatedThePlanView),
  ])
  router.post('/:journeyId/who-created-the-plan', [
    validate(whoCompletedThePlanSchema),
    asyncMiddleware(whoCreatedThePlanController.submitWhoCreatedThePlanForm),
  ])

  router.get('/:journeyId/other-people-consulted', [
    asyncMiddleware(otherPeopleConsultedController.getOtherPeopleConsultedView),
  ])
  router.post('/:journeyId/other-people-consulted', [
    asyncMiddleware(otherPeopleConsultedController.submitOtherPeopleConsultedForm),
  ])

  router.get('/:journeyId/review-needs-conditions-and-strengths', [
    asyncMiddleware(reviewNeedsConditionsStrengthsController.getReviewNeedsConditionsStrengthsView),
  ])
  router.post('/:journeyId/review-needs-conditions-and-strengths', [
    asyncMiddleware(reviewNeedsConditionsStrengthsController.submitReviewNeedsConditionsStrengthsForm),
  ])

  router.get('/:journeyId/learning-environment-adjustments', [
    asyncMiddleware(learningEnvironmentAdjustmentsController.getLearningEnvironmentAdjustmentsView),
  ])
  router.post('/:journeyId/learning-environment-adjustments', [
    validate(learningEnvironmentAdjustmentsSchema),
    asyncMiddleware(learningEnvironmentAdjustmentsController.submitLearningEnvironmentAdjustmentsForm),
  ])

  router.get('/:journeyId/teaching-adjustments', [
    asyncMiddleware(teachingAdjustmentsController.getTeachingAdjustmentsView),
  ])
  router.post('/:journeyId/teaching-adjustments', [
    validate(teachingAdjustmentsSchema),
    asyncMiddleware(teachingAdjustmentsController.submitTeachingAdjustmentsForm),
  ])

  router.get('/:journeyId/specific-teaching-skills', [
    asyncMiddleware(specificTeachingSkillsController.getSpecificTeachingSkillsView),
  ])
  router.post('/:journeyId/specific-teaching-skills', [
    validate(specificTeachingSkillsSchema),
    asyncMiddleware(specificTeachingSkillsController.submitSpecificTeachingSkillsForm),
  ])

  router.get('/:journeyId/exam-arrangements', [asyncMiddleware(examArrangementsController.getExamArrangementsView)])
  router.post('/:journeyId/exam-arrangements', [
    validate(examArrangementsSchema),
    asyncMiddleware(examArrangementsController.submitExamArrangementsForm),
  ])

  router.get('/:journeyId/ehcp', [
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.send('EHCP page')
    }),
  ])

  router.get('/:journeyId/lnsp-support', [
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.send('LNSP support page')
    }),
  ])

  router.get('/:journeyId/next-review-date', [
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.send('Next review date page')
    }),
  ])

  router.get('/:journeyId/check-your-answers', [
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.send('Check your answers page')
    }),
  ])

  return router
}

export default createEducationSupportPlanRoutes
