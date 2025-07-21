import { Router } from 'express'
import type { Services } from '../services'
import searchRoutes from './search'
import { checkPageViewAudited } from '../middleware/auditMiddleware'
import landingPageRoutes from './landingPage'
import profileRoutes from './profile'
import educationSupportPlanRoutes from './education-support-plan'
import retrievePrisonerSummary from '../middleware/retrievePrisonerSummary'
import checkPrisonerInCaseload from '../middleware/checkPrisonerInCaseloadMiddleware'
import strengthsRoutes from './strengths'
import challengesRoutes from './challenges'
import alnScreenerRoutes from './additional-learning-needs-screener'

export default function routes(services: Services): Router {
  const router = Router({ mergeParams: true })

  // Checks page has been audited, if no audit event has been raised router will be skipped
  checkPageViewAudited(router)

  // For all routes that contain the prisonNumber path parameter, retrieve the prisoner and check the prisoner is in the user's caseload
  router.param('prisonNumber', retrievePrisonerSummary(services.prisonerService))
  router.param(
    'prisonNumber',
    checkPrisonerInCaseload({
      allowGlobal: true,
      allowGlobalPom: true,
      allowInactive: true,
      activeCaseloadOnly: false,
    }),
  )

  router.use('/', landingPageRoutes())

  router.use('/search', searchRoutes(services))
  router.use('/profile/:prisonNumber', profileRoutes(services))
  router.use('/education-support-plan/:prisonNumber', educationSupportPlanRoutes(services))
  router.use('/strengths/:prisonNumber', strengthsRoutes(services))
  router.use('/challenges/:prisonNumber', challengesRoutes(services))

  router.use('/aln-screener/:prisonNumber', alnScreenerRoutes(services))

  return router
}
