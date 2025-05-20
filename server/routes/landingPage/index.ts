import { NextFunction, Request, Response, Router } from 'express'
import asyncMiddleware from '../../middleware/asyncMiddleware'

const landingPageRoutes = (): Router => {
  const router = Router({ mergeParams: true })

  // The user's landing page (ie: what they see for page route "/") is dependent on the user's permissions.
  // If they have permission to view session summaries, then they get the Session Summaries page as their landing page
  // (TODO once user roles and Session Summary page has been implemented)
  // Else they get the Search page
  //
  // The approach adopted here is similar to request.forward() as found in Java's servlet spec.
  // It is NOT a client side redirect - the response is NOT a 30x redirect for the client to follow, and the client's
  // URL address bar does not change. It is more like a dynamic URL rewrite.
  // Basically the handler for "/" changes the request URL and then calls the next route handler.

  router.get(
    '/',
    asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
      req.url = req.url.replace(
        /^\//,
        // TODO implement something like this instead of hardcoded path: res.locals.userHasPermissionTo(ApplicationAction.VIEW_SESSION_SUMMARIES) ? '/sessions' : '/search',
        '/search',
      )
      next('route')
    }),
  )
  return router
}

export default landingPageRoutes
