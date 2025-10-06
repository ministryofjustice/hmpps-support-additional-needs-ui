import { Request, Response, Router } from 'express'
import { Services } from '../../../services'
import { checkUserHasPermissionTo } from '../../../middleware/roleBasedAccessControl'
import ApplicationAction from '../../../enums/applicationAction'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import checkEducationSupportPlanDtoExistsInJourneyData from '../middleware/checkEducationSupportPlanDtoExistsInJourneyData'
import { validate } from '../../../middleware/validationMiddleware'
import whoCompletedThePlanSchema from '../validationSchemas/whoCompletedThePlanSchema'
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

  router.use('/', [
    checkUserHasPermissionTo(ApplicationAction.REVIEW_EDUCATION_LEARNER_SUPPORT_PLAN),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/education-support-plan/:prisonNumber/review' - eg: '/education-support-plan/A1234BC/review/473e9ee4-37d6-4afb-92a2-5729b10cc60f/who-created-the-plan'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/who-reviewed-the-plan', [
    retrieveEducationSupportPlan(educationSupportPlanService),
    async (req: Request, res: Response) => {
      res.send('Who reviewed the plan?')
    },
  ])
  router.post('/:journeyId/who-reviewed-the-plan', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(whoCompletedThePlanSchema),
  ])

  router.get('/:journeyId/other-people-consulted', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Were other people consulted?')
    },
  ])
  router.post('/:journeyId/other-people-consulted', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(wereOtherPeopleConsultedSchema),
  ])
  router.get('/:journeyId/other-people-consulted/add-person', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Other people consulted - Add person')
    },
  ])
  router.post('/:journeyId/other-people-consulted/add-person', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(addPersonConsultedSchema),
  ])
  router.get('/:journeyId/other-people-consulted/list', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('List of other people consulted?')
    },
  ])
  router.post('/:journeyId/other-people-consulted/list', [checkEducationSupportPlanDtoExistsInJourneyData])

  router.get('/:journeyId/individual-view-on-progress', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Individuals view on progress')
    },
  ])
  router.post('/:journeyId/individual-view-on-progress', [checkEducationSupportPlanDtoExistsInJourneyData])

  router.get('/:journeyId/your-view-on-progress', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Your view on progress')
    },
  ])
  router.post('/:journeyId/your-view-on-progress', [checkEducationSupportPlanDtoExistsInJourneyData])

  router.get('/:journeyId/review-existing-needs', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Do you want to review existing needs?')
    },
  ])
  router.post('/:journeyId/review-existing-needs', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(reviewExistingNeedsSchema),
  ])

  router.get('/:journeyId/review-existing-needs/strengths', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    retrieveStrengths(strengthService),
    retrieveAlnScreeners(additionalLearningNeedsService),
    async (req: Request, res: Response) => {
      res.send('Review existing strengths')
    },
  ])
  router.post('/:journeyId/review-existing-needs/strengths', [checkEducationSupportPlanDtoExistsInJourneyData])

  router.get('/:journeyId/review-existing-needs/challenges', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    retrieveChallenges(challengeService),
    retrieveAlnScreeners(additionalLearningNeedsService),
    async (req: Request, res: Response) => {
      res.send('Review existing challenges')
    },
  ])
  router.post('/:journeyId/review-existing-needs/challenges', [checkEducationSupportPlanDtoExistsInJourneyData])

  router.get('/:journeyId/review-existing-needs/conditions', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    retrieveConditions(conditionService),
    async (req: Request, res: Response) => {
      res.send('Review existing conditions')
    },
  ])
  router.post('/:journeyId/review-existing-needs/conditions', [checkEducationSupportPlanDtoExistsInJourneyData])

  router.get('/:journeyId/review-existing-needs/support-strategies', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    retrievePrisonsLookup(prisonService),
    retrieveSupportStrategies(supportStrategyService),
    async (req: Request, res: Response) => {
      res.send('Review existing support strategies')
    },
  ])
  router.post('/:journeyId/review-existing-needs/support-strategies', [checkEducationSupportPlanDtoExistsInJourneyData])

  router.get('/:journeyId/teaching-adjustments', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Teaching adjustments')
    },
  ])
  router.post('/:journeyId/teaching-adjustments', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(teachingAdjustmentsSchema),
  ])

  router.get('/:journeyId/specific-teaching-skills', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Teacher knowledge/skills')
    },
  ])
  router.post('/:journeyId/specific-teaching-skills', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(specificTeachingSkillsSchema),
  ])

  router.get('/:journeyId/exam-arrangements', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Exam access arrangements')
    },
  ])
  router.post('/:journeyId/exam-arrangements', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(examArrangementsSchema),
  ])

  router.get('/:journeyId/lnsp-support', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('LNSP support recommendations')
    },
  ])
  router.post('/:journeyId/lnsp-support', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(learningNeedsSupportPractitionerSupportSchema),
  ])

  router.get('/:journeyId/additional-information', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Additional information')
    },
  ])
  router.post('/:journeyId/additional-information', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(additionalInformationSchema),
  ])

  router.get('/:journeyId/next-review-date', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Set next review date')
    },
  ])
  router.post('/:journeyId/next-review-date', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    validate(reviewSupportPlanSchema),
  ])

  router.get('/:journeyId/check-your-answers', [
    checkEducationSupportPlanDtoExistsInJourneyData,
    async (req: Request, res: Response) => {
      res.send('Check your answers')
    },
  ])
  router.post('/:journeyId/check-your-answers', [checkEducationSupportPlanDtoExistsInJourneyData])

  return router
}

export default reviewEducationSupportPlanRoutes
