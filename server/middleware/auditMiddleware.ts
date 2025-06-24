import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../services'
import { Page, PageViewEventDetails } from '../services/auditService'
import asyncMiddleware from './asyncMiddleware'
import logger from '../../logger'

const pageViewEventMap: Record<string, Page> = {
  '/search': Page.SEARCH,

  '/profile/:prisonNumber/overview': Page.PROFILE_OVERVIEW,

  // Create ELSP routes
  '/education-support-plan/:prisonNumber/create/:journeyId/who-created-the-plan': Page.CREATE_ELSP_WHO_CREATED_PLAN,
  '/education-support-plan/:prisonNumber/create/:journeyId/other-people-consulted':
    Page.CREATE_ELSP_OTHER_PEOPLE_CONSULTED,
  '/education-support-plan/:prisonNumber/create/:journeyId/other-people-consulted/add-person':
    Page.CREATE_ELSP_OTHER_PEOPLE_CONSULTED_ADD_PERSON,
  '/education-support-plan/:prisonNumber/create/:journeyId/other-people-consulted/list':
    Page.CREATE_ELSP_OTHER_PEOPLE_CONSULTED_LIST,
  '/education-support-plan/:prisonNumber/create/:journeyId/review-needs-conditions-and-strengths':
    Page.CREATE_ELSP_REVIEW_NEEDS_CONDITIONS_AND_STRENGTHS,
  '/education-support-plan/:prisonNumber/create/:journeyId/teaching-adjustments': Page.CREATE_ELSP_TEACHING_ADJUSTMENTS,
  '/education-support-plan/:prisonNumber/create/:journeyId/learning-environment-adjustments':
    Page.CREATE_ELSP_LEARNING_ENVIRONMENT_ADJUSTMENTS,
  '/education-support-plan/:prisonNumber/create/:journeyId/specific-teaching-skills':
    Page.CREATE_ELSP_SPECIFIC_TEACHING_SKILLS,
  '/education-support-plan/:prisonNumber/create/:journeyId/exam-arrangements': Page.CREATE_ELSP_EXAM_ARRANGEMENTS,
  '/education-support-plan/:prisonNumber/create/:journeyId/education-health-care-plan':
    Page.CREATE_ELSP_EDUCATION_HEALTH_CARE_PLAN,
  '/education-support-plan/:prisonNumber/create/:journeyId/lnsp-support': Page.CREATE_ELSP_LNSP_SUPPORT,
  '/education-support-plan/:prisonNumber/create/:journeyId/additional-information':
    Page.CREATE_ELSP_ADDITIONAL_INFORMATION,
  '/education-support-plan/:prisonNumber/create/:journeyId/next-review-date': Page.CREATE_ELSP_SET_REVIEW_DATE,
  '/education-support-plan/:prisonNumber/create/:journeyId/check-your-answers': Page.CREATE_ELSP_CHECK_YOUR_ANSWERS,

  // Non audit routes. These routes do not raise an audit event
  '/': null,
  '/education-support-plan/:prisonNumber/create/who-created-the-plan': null,
}

export default function auditMiddleware({ auditService }: Services) {
  const auditPageView = (route: string) =>
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      let page: Page
      if (route === '/') {
        // TODO - If the route is for '/' we need to work out which page would have been served based on the user's role
        // For the time being it is always the search page
        page = Page.SEARCH
      } else {
        // else use the PageViewEvent from the configured event map
        ;[, page] = Object.entries(pageViewEventMap).find(([url, _pageViewEvent]) => url === route)
      }

      res.locals.auditPageViewEvent = page

      if (!page) return next()

      const auditDetails: PageViewEventDetails = {
        who: req.user?.username ?? 'UNKNOWN',
        correlationId: req.id,
        details: {
          params: req.params,
          query: req.query,
        },
      }

      if (req.params.prisonNumber) {
        auditDetails.subjectType = 'PRISONER_ID'
        auditDetails.subjectId = req.params.prisonNumber
      }

      auditService.logPageViewAttempt(page, auditDetails) // no need to wait for response

      res.prependOnceListener('finish', () => {
        if (res.statusCode === 200) {
          auditService.logPageView(page, auditDetails)
        }
      })

      return next()
    })

  const router = Router()

  Object.keys(pageViewEventMap).forEach(route => router.get(route, auditPageView(route)))

  return router
}

// Checks page view has been audited, if no audit event has been raised router will be skipped
export function checkPageViewAudited(router: Router) {
  router.get(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.auditPageViewEvent || res.locals.auditPageViewEvent === null) return next()
    logger.error(`No audit event found for route, "${req.path}". Skipping router.`)
    return next('router')
  })
}
