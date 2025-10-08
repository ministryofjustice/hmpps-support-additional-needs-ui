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
import individualViewOnProgressSchema from '../validationSchemas/individualViewOnProgressSchema'
import reviewersViewOnProgressSchema from '../validationSchemas/reviewersViewOnProgressSchema'

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
    async (req: Request, res: Response) => {
      res.send('Do you want to review existing needs?')
    },
  ])
  router.post('/:journeyId/review-existing-needs', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(reviewExistingNeedsSchema),
  ])

  router.get('/:journeyId/review-existing-needs/strengths', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    retrieveStrengths(strengthService),
    retrieveAlnScreeners(additionalLearningNeedsService),
    async (req: Request, res: Response) => {
      res.send('Review existing strengths')
    },
  ])
  router.post('/:journeyId/review-existing-needs/strengths', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
  ])

  router.get('/:journeyId/review-existing-needs/challenges', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    retrieveChallenges(challengeService),
    retrieveAlnScreeners(additionalLearningNeedsService),
    async (req: Request, res: Response) => {
      res.send('Review existing challenges')
    },
  ])
  router.post('/:journeyId/review-existing-needs/challenges', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
  ])

  router.get('/:journeyId/review-existing-needs/conditions', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    retrieveConditions(conditionService),
    async (req: Request, res: Response) => {
      res.send('Review existing conditions')
    },
  ])
  router.post('/:journeyId/review-existing-needs/conditions', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
  ])

  router.get('/:journeyId/review-existing-needs/support-strategies', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    retrieveSupportStrategies(supportStrategyService),
    async (req: Request, res: Response) => {
      res.send('Review existing support strategies')
    },
  ])
  router.post('/:journeyId/review-existing-needs/support-strategies', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
  ])

  router.get('/:journeyId/teaching-adjustments', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Teaching adjustments')
    },
  ])
  router.post('/:journeyId/teaching-adjustments', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    checkReviewEducationSupportPlanDtoExistsInJourneyData,
    validate(teachingAdjustmentsSchema),
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
