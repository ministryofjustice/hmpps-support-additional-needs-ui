import { Router } from 'express'
import { Services } from '../../../services'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import WhoCreatedThePlanController from './who-created-the-plan/whoCreatedThePlanController'
import OtherPeopleConsultedController from './other-people-consulted/otherPeopleConsultedController'
import AddPersonConsultedController from './other-people-consulted/addPersonConsultedController'
import OtherPeopleConsultedListController from './other-people-consulted/otherPeopleConsultedListController'
import ReviewNeedsConditionsStrengthsController from './review-needs-conditions-strengths/reviewNeedsConditionsStrengthsController'
import IndividualSupportRequirementsController from './individual-support-requirements/individualSupportRequirementsController'
import TeachingAdjustmentsController from './teaching-adjustments/teachingAdjustmentsController'
import SpecificTeachingSkillsController from './specific-teaching-skills/specificTeachingSkillsController'
import ExamArrangementsController from './exam-arrangements/examArrangementsController'
import EducationHealthCarePlanController from './education-health-care-plan/educationHealthCarePlanController'
import LearningNeedsSupportPractitionerSupportController from './learning-needs-support-practitioner-support/learningNeedsSupportPractitionerSupportController'
import AdditionalInformationController from './additional-information/additionalInformationController'
import ReviewSupportPlanController from './review-support-plan/reviewSupportPlanController'
import CheckYourAnswersController from './check-your-answers/checkYourAnswersController'
import { validate } from '../../../middleware/validationMiddleware'
import whoCompletedThePlanSchema from '../validationSchemas/whoCompletedThePlanSchema'
import teachingAdjustmentsSchema from '../validationSchemas/teachingAdjustmentsSchema'
import specificTeachingSkillsSchema from '../validationSchemas/specificTeachingSkillsSchema'
import examArrangementsSchema from '../validationSchemas/examArrangementsSchema'
import educationHealthCarePlanSchema from '../validationSchemas/educationHealthCarePlanSchema'
import learningNeedsSupportPractitionerSupportSchema from '../validationSchemas/learningNeedsSupportPractitionerSupportSchema'
import reviewSupportPlanSchema from '../validationSchemas/reviewSupportPlanSchema'
import checkEducationSupportPlanDtoExistsInJourneyData from './middleware/checkEducationSupportPlanDtoExistsInJourneyData'
import createEmptyEducationSupportPlanDtoIfNotInJourneyData from './middleware/createEmptyEducationSupportPlanDtoIfNotInJourneyData'
import wereOtherPeopleConsultedSchema from '../validationSchemas/wereOtherPeopleConsultedSchema'
import addPersonConsultedSchema from '../validationSchemas/addPersonConsultedSchema'
import additionalInformationSchema from '../validationSchemas/additionalInformationSchema'
import individualSupportRequirementsSchema from '../validationSchemas/individualSupportRequirementsSchema'

const createEducationSupportPlanRoutes = (services: Services): Router => {
  const { educationSupportPlanService, journeyDataService } = services
  const router = Router({ mergeParams: true })

  const whoCreatedThePlanController = new WhoCreatedThePlanController()
  const otherPeopleConsultedController = new OtherPeopleConsultedController()
  const addPersonConsultedController = new AddPersonConsultedController()
  const otherPeopleConsultedListController = new OtherPeopleConsultedListController()
  const reviewNeedsConditionsStrengthsController = new ReviewNeedsConditionsStrengthsController()
  const individualSupportRequirementsController = new IndividualSupportRequirementsController()
  const teachingAdjustmentsController = new TeachingAdjustmentsController()
  const specificTeachingSkillsController = new SpecificTeachingSkillsController()
  const examArrangementsController = new ExamArrangementsController()
  const educationHealthCarePlanController = new EducationHealthCarePlanController()
  const lnspController = new LearningNeedsSupportPractitionerSupportController()
  const additionalInformationController = new AdditionalInformationController()
  const reviewSupportPlanController = new ReviewSupportPlanController()
  const checkYourAnswersController = new CheckYourAnswersController(educationSupportPlanService)

  router.use('/', [
    // TODO - enable this line when we understand the RBAC roles and permissions
    // checkUserHasPermissionTo(ApplicationAction.RECORD_EDUCATION_LEARNER_SUPPORT_PLAN),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/education-support-plan/:prisonNumber/create' - eg: '/education-support-plan/A1234BC/create/473e9ee4-37d6-4afb-92a2-5729b10cc60f/who-created-the-plan'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/who-created-the-plan', [
    createEmptyEducationSupportPlanDtoIfNotInJourneyData,
    asyncMiddleware(whoCreatedThePlanController.getWhoCreatedThePlanView),
  ])
  router.post('/:journeyId/who-created-the-plan', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(whoCompletedThePlanSchema),
    asyncMiddleware(whoCreatedThePlanController.submitWhoCreatedThePlanForm),
  ])

  router.get('/:journeyId/other-people-consulted', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(otherPeopleConsultedController.getOtherPeopleConsultedView),
  ])
  router.post('/:journeyId/other-people-consulted', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(wereOtherPeopleConsultedSchema),
    asyncMiddleware(otherPeopleConsultedController.submitOtherPeopleConsultedForm),
  ])
  router.get('/:journeyId/other-people-consulted/add-person', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(addPersonConsultedController.getAddPersonConsultedView),
  ])
  router.post('/:journeyId/other-people-consulted/add-person', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(addPersonConsultedSchema),
    asyncMiddleware(addPersonConsultedController.submitAddPersonConsultedForm),
  ])
  router.get('/:journeyId/other-people-consulted/list', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(otherPeopleConsultedListController.getOtherPeopleConsultedListView),
  ])
  router.post('/:journeyId/other-people-consulted/list', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(otherPeopleConsultedListController.submitOtherPeopleConsultedListForm),
  ])

  router.get('/:journeyId/review-needs-conditions-and-strengths', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewNeedsConditionsStrengthsController.getReviewNeedsConditionsStrengthsView),
  ])
  router.post('/:journeyId/review-needs-conditions-and-strengths', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewNeedsConditionsStrengthsController.submitReviewNeedsConditionsStrengthsForm),
  ])

  router.get('/:journeyId/individual-support-requirements', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(individualSupportRequirementsController.getIndividualSupportRequirementsView),
  ])
  router.post('/:journeyId/individual-support-requirements', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(individualSupportRequirementsSchema),
    asyncMiddleware(individualSupportRequirementsController.submitIndividualSupportRequirementsForm),
  ])

  router.get('/:journeyId/teaching-adjustments', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(teachingAdjustmentsController.getTeachingAdjustmentsView),
  ])
  router.post('/:journeyId/teaching-adjustments', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(teachingAdjustmentsSchema),
    asyncMiddleware(teachingAdjustmentsController.submitTeachingAdjustmentsForm),
  ])

  router.get('/:journeyId/specific-teaching-skills', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(specificTeachingSkillsController.getSpecificTeachingSkillsView),
  ])
  router.post('/:journeyId/specific-teaching-skills', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(specificTeachingSkillsSchema),
    asyncMiddleware(specificTeachingSkillsController.submitSpecificTeachingSkillsForm),
  ])

  router.get('/:journeyId/exam-arrangements', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(examArrangementsController.getExamArrangementsView),
  ])
  router.post('/:journeyId/exam-arrangements', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(examArrangementsSchema),
    asyncMiddleware(examArrangementsController.submitExamArrangementsForm),
  ])

  router.get('/:journeyId/education-health-care-plan', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(educationHealthCarePlanController.getEhcpView),
  ])
  router.post('/:journeyId/education-health-care-plan', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(educationHealthCarePlanSchema),
    asyncMiddleware(educationHealthCarePlanController.submitEhcpForm),
  ])

  router.get('/:journeyId/lnsp-support', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(lnspController.getLnspSupportView),
  ])
  router.post('/:journeyId/lnsp-support', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(learningNeedsSupportPractitionerSupportSchema),
    asyncMiddleware(lnspController.submitLnspSupportForm),
  ])

  router.get('/:journeyId/additional-information', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(additionalInformationController.getAdditionalInformationView),
  ])
  router.post('/:journeyId/additional-information', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(additionalInformationSchema),
    asyncMiddleware(additionalInformationController.submitAdditionalInformationForm),
  ])

  router.get('/:journeyId/next-review-date', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewSupportPlanController.getReviewSupportPlanView),
  ])
  router.post('/:journeyId/next-review-date', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(reviewSupportPlanSchema),
    asyncMiddleware(reviewSupportPlanController.submitReviewSupportPlanForm),
  ])

  router.get('/:journeyId/check-your-answers', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(checkYourAnswersController.getCheckYourAnswersView),
  ])
  router.post('/:journeyId/check-your-answers', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(checkYourAnswersController.submitCheckYourAnswersForm),
  ])

  return router
}

export default createEducationSupportPlanRoutes
