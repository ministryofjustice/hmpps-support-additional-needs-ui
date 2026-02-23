import { Request, Router } from 'express'
import { PrisonerBasePermission, prisonerPermissionsGuard } from '@ministryofjustice/hmpps-prison-permissions-lib'
import type { Services } from '../services'
import searchRoutes from './search'
import { checkPageViewAudited } from '../middleware/auditMiddleware'
import landingPageRoutes from './landingPage'
import profileRoutes from './profile'
import educationSupportPlanRoutes from './education-support-plan'
import retrievePrisonerSummary from '../middleware/retrievePrisonerSummary'
import strengthsRoutes from './strengths'
import challengesRoutes from './challenges'
import alnScreenerRoutes from './additional-learning-needs-screener'
import conditionsRoutes from './conditions'
import supportStrategiesRoutes from './support-strategies'
import { checkUserHasPermissionTo } from '../middleware/roleBasedAccessControl'
import ApplicationAction from '../enums/applicationAction'

export default function routes(services: Services): Router {
  const { prisonPermissionsService } = services

  const router = Router({ mergeParams: true })

  // Checks page has been audited, if no audit event has been raised router will be skipped
  checkPageViewAudited(router)

  // For all routes that contain the prisonNumber path parameter, retrieve the prisoner and check the prisoner is in the user's caseload
  router.param('prisonNumber', retrievePrisonerSummary(services.prisonerService))
  router.param(
    'prisonNumber',
    prisonerPermissionsGuard(prisonPermissionsService, {
      requestDependentOn: [PrisonerBasePermission.read],
      getPrisonerNumberFunction: (req: Request) => req.params.prisonNumber,
    }),
  )

  router.use('/', landingPageRoutes())

  router.use('/search', [
    //
    checkUserHasPermissionTo(ApplicationAction.SEARCH),
    searchRoutes(services),
  ])
  router.use('/profile/:prisonNumber', [
    checkUserHasPermissionTo(ApplicationAction.VIEW_PROFILE),
    profileRoutes(services),
  ])
  router.use('/education-support-plan/:prisonNumber', educationSupportPlanRoutes(services))
  router.use('/strengths/:prisonNumber', strengthsRoutes(services))
  router.use('/challenges/:prisonNumber', challengesRoutes(services))
  router.use('/conditions/:prisonNumber', conditionsRoutes(services))
  router.use('/support-strategies/:prisonNumber', supportStrategiesRoutes(services))
  router.use('/aln-screener/:prisonNumber', alnScreenerRoutes(services))

  return router
}
