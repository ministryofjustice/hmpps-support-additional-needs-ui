import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../services'
import { Page, PageViewEventDetails } from '../services/auditService'
import asyncMiddleware from './asyncMiddleware'
import logger from '../../logger'

const pageViewEventMap: Record<string, Page> = {
  '/search': Page.SEARCH,

  // Non audit routes. These routes do not raise an audit event
  '/': null,
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
