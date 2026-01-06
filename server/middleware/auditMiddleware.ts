import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../services'
import { Page, BaseAuditData } from '../services/auditService'
import asyncMiddleware from './asyncMiddleware'
import logger from '../../logger'

const pageViewEventMap: Record<string, Page> = {
  '/search': Page.SEARCH,

  // Profile routes
  '/profile/:prisonNumber/overview': Page.PROFILE_OVERVIEW,
  '/profile/:prisonNumber/support-strategies': Page.PROFILE_SUPPORT_STRATEGIES,
  '/profile/:prisonNumber/conditions': Page.PROFILE_CONDITIONS,
  '/profile/:prisonNumber/strengths': Page.PROFILE_STRENGTHS,
  '/profile/:prisonNumber/challenges': Page.PROFILE_CHALLENGES,
  '/profile/:prisonNumber/education-support-plan': Page.PROFILE_EDUCATION_SUPPORT_PLAN,

  // Create ELSP routes
  '/education-support-plan/:prisonNumber/create/:journeyId/who-created-the-plan': Page.CREATE_ELSP_WHO_CREATED_PLAN,
  '/education-support-plan/:prisonNumber/create/:journeyId/other-people-consulted':
    Page.CREATE_ELSP_OTHER_PEOPLE_CONSULTED,
  '/education-support-plan/:prisonNumber/create/:journeyId/other-people-consulted/add-person':
    Page.CREATE_ELSP_OTHER_PEOPLE_CONSULTED_ADD_PERSON,
  '/education-support-plan/:prisonNumber/create/:journeyId/other-people-consulted/list':
    Page.CREATE_ELSP_OTHER_PEOPLE_CONSULTED_LIST,
  '/education-support-plan/:prisonNumber/create/:journeyId/review-existing-needs':
    Page.CREATE_ELSP_REVIEW_EXISTING_NEEDS,
  '/education-support-plan/:prisonNumber/create/:journeyId/review-existing-needs/strengths':
    Page.CREATE_ELSP_REVIEW_EXISTING_STRENGTHS,
  '/education-support-plan/:prisonNumber/create/:journeyId/review-existing-needs/challenges':
    Page.CREATE_ELSP_REVIEW_EXISTING_CHALLENGES,
  '/education-support-plan/:prisonNumber/create/:journeyId/review-existing-needs/conditions':
    Page.CREATE_ELSP_REVIEW_EXISTING_CONDITIONS,
  '/education-support-plan/:prisonNumber/create/:journeyId/review-existing-needs/support-strategies':
    Page.CREATE_ELSP_REVIEW_EXISTING_SUPPORT_STRATEGIES,
  '/education-support-plan/:prisonNumber/create/:journeyId/individual-support-requirements':
    Page.CREATE_ELSP_INDIVIDUAL_SUPPORT_REQUIREMENTS,
  '/education-support-plan/:prisonNumber/create/:journeyId/teaching-adjustments': Page.CREATE_ELSP_TEACHING_ADJUSTMENTS,
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

  // Update ELSP routes
  '/education-support-plan/:prisonNumber/update/:journeyId/education-health-care-plan':
    Page.UPDATE_ELSP_EDUCATION_HEALTH_CARE_PLAN,

  // Prisoner refuses creation of ELSP routes
  '/education-support-plan/:prisonNumber/refuse-plan/:journeyId/reason': Page.REFUSE_ELSP_REASON,

  // Review ELSP routes
  '/education-support-plan/:prisonNumber/review/:journeyId/who-reviewed-the-plan': Page.REVIEW_ELSP_WHO_REVIEWED_PLAN,
  '/education-support-plan/:prisonNumber/review/:journeyId/other-people-consulted':
    Page.REVIEW_ELSP_OTHER_PEOPLE_CONSULTED,
  '/education-support-plan/:prisonNumber/review/:journeyId/other-people-consulted/add-person':
    Page.REVIEW_ELSP_OTHER_PEOPLE_CONSULTED_ADD_PERSON,
  '/education-support-plan/:prisonNumber/review/:journeyId/other-people-consulted/list':
    Page.REVIEW_ELSP_OTHER_PEOPLE_CONSULTED_LIST,
  '/education-support-plan/:prisonNumber/review/:journeyId/individual-view-on-progress':
    Page.REVIEW_ELSP_INDIVIDUAL_VIEW_ON_PROGRESS,
  '/education-support-plan/:prisonNumber/review/:journeyId/reviewers-view-on-progress':
    Page.REVIEW_ELSP_REVIEWERS_VIEW_ON_PROGRESS,
  '/education-support-plan/:prisonNumber/review/:journeyId/review-existing-needs':
    Page.REVIEW_ELSP_REVIEW_EXISTING_NEEDS,
  '/education-support-plan/:prisonNumber/review/:journeyId/review-existing-needs/strengths':
    Page.REVIEW_ELSP_REVIEW_EXISTING_STRENGTHS,
  '/education-support-plan/:prisonNumber/review/:journeyId/review-existing-needs/challenges':
    Page.REVIEW_ELSP_REVIEW_EXISTING_CHALLENGES,
  '/education-support-plan/:prisonNumber/review/:journeyId/review-existing-needs/conditions':
    Page.REVIEW_ELSP_REVIEW_EXISTING_CONDITIONS,
  '/education-support-plan/:prisonNumber/review/:journeyId/review-existing-needs/support-strategies':
    Page.REVIEW_ELSP_REVIEW_EXISTING_SUPPORT_STRATEGIES,
  '/education-support-plan/:prisonNumber/review/:journeyId/teaching-adjustments': Page.REVIEW_ELSP_TEACHING_ADJUSTMENTS,
  '/education-support-plan/:prisonNumber/review/:journeyId/specific-teaching-skills':
    Page.REVIEW_ELSP_SPECIFIC_TEACHING_SKILLS,
  '/education-support-plan/:prisonNumber/review/:journeyId/exam-arrangements': Page.REVIEW_ELSP_EXAM_ARRANGEMENTS,
  '/education-support-plan/:prisonNumber/review/:journeyId/lnsp-support': Page.REVIEW_ELSP_LNSP_SUPPORT,
  '/education-support-plan/:prisonNumber/review/:journeyId/additional-information':
    Page.REVIEW_ELSP_ADDITIONAL_INFORMATION,
  '/education-support-plan/:prisonNumber/review/:journeyId/next-review-date': Page.REVIEW_ELSP_SET_REVIEW_DATE,
  '/education-support-plan/:prisonNumber/review/:journeyId/check-your-answers': Page.REVIEW_ELSP_CHECK_YOUR_ANSWERS,

  // Create strengths routes
  '/strengths/:prisonNumber/create/:journeyId/select-category': Page.CREATE_STRENGTH_CATEGORY,
  '/strengths/:prisonNumber/create/:journeyId/detail': Page.CREATE_STRENGTH_DETAILS,

  // Edit strengths routes
  '/strengths/:prisonNumber/:strengthReference/edit/:journeyId/detail': Page.EDIT_STRENGTH_DETAILS,

  // Archive strengths routes
  '/strengths/:prisonNumber/:strengthReference/archive/:journeyId/reason': Page.ARCHIVE_STRENGTH_REASON,

  // Create challenges routes
  '/challenges/:prisonNumber/create/:journeyId/select-category': Page.CREATE_CHALLENGE_CATEGORY,
  '/challenges/:prisonNumber/create/:journeyId/detail': Page.CREATE_CHALLENGE_DETAILS,

  // Edit challenges routes
  '/challenges/:prisonNumber/:challengeReference/edit/:journeyId/detail': Page.EDIT_CHALLENGE_DETAILS,

  // Archive challenges routes
  '/challenges/:prisonNumber/:challengeReference/archive/:journeyId/reason': Page.ARCHIVE_CHALLENGE_REASON,

  // Record ALN Screener routes
  '/aln-screener/:prisonNumber/create/:journeyId/screener-date': Page.RECORD_ALN_SCREENER_DATE,
  '/aln-screener/:prisonNumber/create/:journeyId/add-challenges': Page.RECORD_ALN_SCREENER_CHALLENGES,
  '/aln-screener/:prisonNumber/create/:journeyId/add-strengths': Page.RECORD_ALN_SCREENER_STRENGTHS,
  '/aln-screener/:prisonNumber/create/:journeyId/check-your-answers': Page.RECORD_ALN_SCREENER_CHECK_YOUR_ANSWERS,

  // Create conditions routes
  '/conditions/:prisonNumber/create/:journeyId/select-conditions': Page.CREATE_CONDITIONS_SELECT_CONDITIONS,
  '/conditions/:prisonNumber/create/:journeyId/details': Page.CREATE_CONDITIONS_DETAILS,

  // Edit conditions routes
  '/conditions/:prisonNumber/:conditionReference/edit/:journeyId/detail': Page.EDIT_CONDITION_DETAILS,

  // Archive conditions routes
  '/conditions/:prisonNumber/:conditionReference/archive/:journeyId/reason': Page.ARCHIVE_CONDITION_REASON,

  // Create Support Strategies routes
  '/support-strategies/:prisonNumber/create/:journeyId/select-category': Page.CREATE_SUPPORT_STRATEGY_CATEGORY,
  '/support-strategies/:prisonNumber/create/:journeyId/detail': Page.CREATE_SUPPORT_STRATEGY_DETAILS,

  // Edit Support Strategies routes
  '/support-strategies/:prisonNumber/:supportStrategyReference/edit/:journeyId/detail':
    Page.EDIT_SUPPORT_STRATEGY_DETAILS,

  // Archive Support Strategies routes
  '/support-strategies/:prisonNumber/:supportStrategyReference/archive/:journeyId/reason':
    Page.ARCHIVE_SUPPORT_STRATEGY_REASON,

  // Non audit routes. These routes do not raise an audit event
  '/': null,
  '/favicon.ico': null,
  '/education-support-plan/:prisonNumber/create/start': null,
  '/education-support-plan/:prisonNumber/create/:journeyId/start': null,
  '/education-support-plan/:prisonNumber/update/education-health-care-plan': null,
  '/education-support-plan/:prisonNumber/refuse-plan/reason': null,
  '/education-support-plan/:prisonNumber/review/start': null,
  '/education-support-plan/:prisonNumber/review/:journeyId/start': null,
  '/strengths/:prisonNumber/create/select-category': null,
  '/strengths/:prisonNumber/:strengthReference/edit/detail': null,
  '/strengths/:prisonNumber/:strengthReference/archive/reason': null,
  '/challenges/:prisonNumber/create/select-category': null,
  '/challenges/:prisonNumber/:challengeReference/edit/detail': null,
  '/challenges/:prisonNumber/:challengeReference/archive/reason': null,
  '/aln-screener/:prisonNumber/create/screener-date': null,
  '/conditions/:prisonNumber/create/select-conditions': null,
  '/conditions/:prisonNumber/:conditionReference/edit/detail': null,
  '/conditions/:prisonNumber/:conditionReference/archive/reason': null,
  '/support-strategies/:prisonNumber/create/select-category': null,
  '/support-strategies/:prisonNumber/:supportStrategyReference/edit/detail': null,
  '/support-strategies/:prisonNumber/:supportStrategyReference/archive/reason': null,
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

      const auditDetails: BaseAuditData = {
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
