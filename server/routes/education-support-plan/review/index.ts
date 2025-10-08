import { Request, Response, Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import checkEducationSupportPlanDtoExistsInJourneyData from '../middleware/checkEducationSupportPlanDtoExistsInJourneyData'
import { validate } from '../../../middleware/validationMiddleware'
import whoReviewedThePlanSchema from '../validationSchemas/whoReviewedThePlanSchema'
import wereOtherPeopleConsultedSchema from '../validationSchemas/wereOtherPeopleConsultedSchema'
import addPersonConsultedSchema from '../validationSchemas/addPersonConsultedSchema'
import reviewExistingNeedsSchema from '../validationSchemas/reviewExistingNeedsSchema'
import retrievePrisonsLookup from '../../middleware/retrievePrisonsLookup'
import retrieveStrengths from '../../middleware/retrieveStrengths'
import retrieveAlnScreeners from '../../middleware/retrieveAlnScreeners'
import retrieveChallenges from '../../middleware/retrieveChallenges'
import retrieveConditions from '../../middleware/retrieveConditions'
import retrieveSupportStrategies from '../../middleware/retrieveSupportStrategies'
import teachingAdjustmentsSchema from '../validationSchemas/teachingAdjustmentsSchema'
import specificTeachingSkillsSchema from '../validationSchemas/specificTeachingSkillsSchema'
import examArrangementsSchema from '../validationSchemas/examArrangementsSchema'
import learningNeedsSupportPractitionerSupportSchema from '../validationSchemas/learningNeedsSupportPractitionerSupportSchema'
import additionalInformationSchema from '../validationSchemas/additionalInformationSchema'
import reviewSupportPlanSchema from '../validationSchemas/reviewSupportPlanSchema'
import individualViewOnProgressSchema from '../validationSchemas/individualViewOnProgressSchema'
import reviewersViewOnProgressSchema from '../validationSchemas/reviewersViewOnProgressSchema'
import retrieveEducationSupportPlan from './middleware/retrieveEducationSupportPlan'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import createEmptyReviewEducationSupportPlanDtoIfNotInJourneyData from './middleware/createEmptyReviewEducationSupportPlanDtoIfNotInJourneyData'
import checkReviewEducationSupportPlanDtoExistsInJourneyData from './middleware/checkReviewEducationSupportPlanDtoExistsInJourneyData'
import WhoReviewedThePlanController from './who-reviewed-the-plan/whoReviewedThePlanController'
import OtherPeopleConsultedController from './other-people-consulted/otherPeopleConsultedController'
import AddPersonConsultedController from './other-people-consulted/addPersonConsultedController'
import OtherPeopleConsultedListController from './other-people-consulted/otherPeopleConsultedListController'
import IndividualViewOnProgressController from './individual-view-on-progress/individualViewOnProgressController'
import ReviewersViewOnProgressController from './reviewers-view-on-progress/reviewersViewOnProgressController'
import ReviewExistingNeedsController from './review-existing-needs/reviewExistingNeedsController'
import ReviewExistingStrengthsController from './review-existing-needs/reviewExistingStrengthsController'
import ReviewExistingChallengesController from './review-existing-needs/reviewExistingChallengesController'
import ReviewExistingConditionsController from './review-existing-needs/reviewExistingConditionsController'
import ReviewExistingSupportStrategiesController from './review-existing-needs/reviewExistingSupportStrategiesController'
import TeachingAdjustmentsController from './teaching-adjustments/teachingAdjustmentsController'

const reviewEducationSupportPlanRoutes = (services: Services): Router => {
  const {
    additionalLearningNeedsService,
    challengeService,
    conditionService,
    educationSupportPlanService,
    journeyDataService,
    prisonService,
    strengthService,
    supportStrategyService,
  } = services
  const router = Router({ mergeParams: true })

  const whoReviewedThePlanController = new WhoReviewedThePlanController()
  const otherPeopleConsultedController = new OtherPeopleConsultedController()
  const addPersonConsultedController = new AddPersonConsultedController()
  const otherPeopleConsultedListController = new OtherPeopleConsultedListController()
  const individualViewOnProgressController = new IndividualViewOnProgressController()
  const reviewersViewOnProgressController = new ReviewersViewOnProgressController()
  const reviewExistingNeedsController = new ReviewExistingNeedsController()
  const reviewExistingStrengthsController = new ReviewExistingStrengthsController()
  const reviewExistingChallengesController = new ReviewExistingChallengesController()
  const reviewExistingConditionsController = new ReviewExistingConditionsController()
  const reviewExistingSupportStrategiesController = new ReviewExistingSupportStrategiesController()
  const teachingAdjustmentsController = new TeachingAdjustmentsController()

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.REVIEW_EDUCATION_LEARNER_SUPPORT_PLAN),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/education-support-plan/:prisonNumber/review' - eg: '/education-support-plan/A1234BC/review/473e9ee4-37d6-4afb-92a2-5729b10cc60f/who-created-the-plan'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/who-reviewed-the-plan', [
    retrieveEducationSupportPlan(educationSupportPlanService),
    createEmptyReviewEducationSupportPlanDtoIfNotInJourneyData,
    asyncMiddleware(whoReviewedThePlanController.getWhoReviewedThePlanView),
  ])
  router.post('/:journeyId/who-reviewed-the-plan', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(whoReviewedThePlanSchema),
    asyncMiddleware(whoReviewedThePlanController.submitWhoReviewedThePlanForm),
  ])

  router.get('/:journeyId/other-people-consulted', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(otherPeopleConsultedController.getOtherPeopleConsultedView),
  ])
  router.post('/:journeyId/other-people-consulted', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(wereOtherPeopleConsultedSchema({ journey: 'review' })),
    asyncMiddleware(otherPeopleConsultedController.submitOtherPeopleConsultedForm),
  ])
  router.get('/:journeyId/other-people-consulted/add-person', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(addPersonConsultedController.getAddPersonConsultedView),
  ])
  router.post('/:journeyId/other-people-consulted/add-person', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(addPersonConsultedSchema({ journey: 'review' })),
    asyncMiddleware(addPersonConsultedController.submitAddPersonConsultedForm),
  ])
  router.get('/:journeyId/other-people-consulted/list', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(otherPeopleConsultedListController.getOtherPeopleConsultedListView),
  ])
  router.post('/:journeyId/other-people-consulted/list', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(otherPeopleConsultedListController.submitOtherPeopleConsultedListForm),
  ])

  router.get('/:journeyId/individual-view-on-progress', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(individualViewOnProgressController.getIndividualViewOnProgressView),
  ])
  router.post('/:journeyId/individual-view-on-progress', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(individualViewOnProgressSchema),
    asyncMiddleware(individualViewOnProgressController.submitIndividualViewOnProgressForm),
  ])

  router.get('/:journeyId/reviewers-view-on-progress', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewersViewOnProgressController.getReviewersViewOnProgressView),
  ])
  router.post('/:journeyId/reviewers-view-on-progress', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(reviewersViewOnProgressSchema),
    asyncMiddleware(reviewersViewOnProgressController.submitReviewersViewOnProgressForm),
  ])

  router.get('/:journeyId/review-existing-needs', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewExistingNeedsController.getReviewExistingNeedsView),
  ])
  router.post('/:journeyId/review-existing-needs', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(reviewExistingNeedsSchema({ journey: 'review' })),
    asyncMiddleware(reviewExistingNeedsController.submitReviewExistingNeedsForm),
  ])

  router.get('/:journeyId/review-existing-needs/strengths', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    retrieveStrengths(strengthService),
    retrieveAlnScreeners(additionalLearningNeedsService),
    asyncMiddleware(reviewExistingStrengthsController.getReviewExistingStrengthsView),
  ])
  router.post('/:journeyId/review-existing-needs/strengths', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewExistingStrengthsController.submitReviewExistingStrengthsForm),
  ])

  router.get('/:journeyId/review-existing-needs/challenges', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    retrieveChallenges(challengeService),
    retrieveAlnScreeners(additionalLearningNeedsService),
    asyncMiddleware(reviewExistingChallengesController.getReviewExistingChallengesView),
  ])
  router.post('/:journeyId/review-existing-needs/challenges', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewExistingChallengesController.submitReviewExistingChallengesForm),
  ])

  router.get('/:journeyId/review-existing-needs/conditions', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    retrieveConditions(conditionService),
    asyncMiddleware(reviewExistingConditionsController.getReviewExistingConditionsView),
  ])
  router.post('/:journeyId/review-existing-needs/conditions', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewExistingConditionsController.submitReviewExistingConditionsForm),
  ])

  router.get('/:journeyId/review-existing-needs/support-strategies', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    retrieveSupportStrategies(supportStrategyService),
    asyncMiddleware(reviewExistingSupportStrategiesController.getReviewExistingSupportStrategiesView),
  ])
  router.post('/:journeyId/review-existing-needs/support-strategies', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(reviewExistingSupportStrategiesController.submitReviewExistingSupportStrategiesForm),
  ])

  router.get('/:journeyId/teaching-adjustments', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    asyncMiddleware(teachingAdjustmentsController.getTeachingAdjustmentsView),
  ])
  router.post('/:journeyId/teaching-adjustments', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(teachingAdjustmentsSchema({ journey: 'review' })),
    asyncMiddleware(teachingAdjustmentsController.submitTeachingAdjustmentsForm),
  ])

  router.get('/:journeyId/specific-teaching-skills', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Teacher knowledge/skills')
    },
  ])
  router.post('/:journeyId/specific-teaching-skills', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(specificTeachingSkillsSchema),
  ])

  router.get('/:journeyId/exam-arrangements', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Exam access arrangements')
    },
  ])
  router.post('/:journeyId/exam-arrangements', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(examArrangementsSchema),
  ])

  router.get('/:journeyId/lnsp-support', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('LNSP support recommendations')
    },
  ])
  router.post('/:journeyId/lnsp-support', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(learningNeedsSupportPractitionerSupportSchema),
  ])

  router.get('/:journeyId/additional-information', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Additional information')
    },
  ])
  router.post('/:journeyId/additional-information', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(additionalInformationSchema),
  ])

  router.get('/:journeyId/next-review-date', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Set next review date')
    },
  ])
  router.post('/:journeyId/next-review-date', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(reviewSupportPlanSchema),
  ])

  router.get('/:journeyId/check-your-answers', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Check your answers')
    },
  ])
  router.post('/:journeyId/check-your-answers', [checkEducationSupportPlanDtoExistsInJourneyData])

  return router
}

export default reviewEducationSupportPlanRoutes
