import { Router } from 'express'
import type { Services } from '../services'
import searchRoutes from './search'
import { checkPageViewAudited } from '../middleware/auditMiddleware'
import landingPageRoutes from './landingPage'
import profileRoutes from './profile'

export default function routes(services: Services): Router {
  const router = Router({ mergeParams: true })

  // Checks page has been audited, if no audit event has been raised router will be skipped
  checkPageViewAudited(router)

  router.use('/', landingPageRoutes())

  router.use('/search', searchRoutes(services))
  router.use('/profile/:prisonNumber', profileRoutes(services))
  return router
}
