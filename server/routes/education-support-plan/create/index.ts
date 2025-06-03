import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../../../services'
import insertJourneyIdentifier from '../../../middleware/insertJourneyIdentifier'
import setupJourneyData from '../../../middleware/setupJourneyData'
import asyncMiddleware from '../../../middleware/asyncMiddleware'

const createEducationSupportPlanRoutes = (services: Services): Router => {
  const { journeyDataService } = services
  const router = Router({ mergeParams: true })

  router.use('/', [
    // TODO - enable this line when we understand the RBAC roles and permissions
    // checkUserHasPermissionTo(ApplicationAction.RECORD_EDUCATION_LEARNER_SUPPORT_PLAN),
    insertJourneyIdentifier({ insertIdAfterElement: 3 }), // insert journey ID immediately after '/education-support-plan/:prisonNumber/create' - eg: '/education-support-plan/A1234BC/create/473e9ee4-37d6-4afb-92a2-5729b10cc60f/who-created-the-plan'
  ])
  router.use('/:journeyId', [setupJourneyData(journeyDataService)])

  router.get('/:journeyId/who-created-the-plan', [
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.send('Who create the plan page')
    }),
  ])

  router.get('/:journeyId/other-people-consulted', [
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.send('Other people consulted page')
    }),
  ])

  router.get('/:journeyId/review-needs-conditions-and-strengths', [
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.send('Review needs conditions and strengths page')
    }),
  ])

  router.get('/:journeyId/teaching-adjustments', [
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.send('Teaching adjustments page')
    }),
  ])

  router.get('/:journeyId/learning-environment-adjustments', [
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.send('Learning environments adjustments page')
    }),
  ])

  router.get('/:journeyId/specific-teaching-skills', [
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.send('Specific teaching skills page')
    }),
  ])

  router.get('/:journeyId/exam-arrangements', [
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.send('Exam arrangements page')
    }),
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
