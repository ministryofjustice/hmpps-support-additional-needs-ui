import { NextFunction, Request, Response, Router } from 'express'
import jwksRsa from 'jwks-rsa'
import { expressjwt, GetVerificationKey } from 'express-jwt'
import { PrisonerBasePermission, prisonerPermissionsGuard } from '@ministryofjustice/hmpps-prison-permissions-lib'
import { Services } from '../../services'
import config from '../../config'
import additionalNeedsContentFragmentRoutes from './additional-needs'
import retrievePrisonerSummary from '../../middleware/retrievePrisonerSummary'
import setUpCurrentUser from '../../middleware/setUpCurrentUser'

/**
 * Set up the routes used for returning content fragments
 *
 * Content fragments are small fragments of page markup that can be injected into other services. For example, Prisoner
 * Profile uses a fragment served from SAN UI that contains the marked up SAN data for the prisoner.
 * This approach means that SAN is responsible for calling its own API and for processing the data into a small
 * nunjucks template.
 *
 * This setup MUST happen before the main call to the setUpAuthentication middleware as it uses the X-USER-TOKEN header
 * to carry the user token.
 */
const setupContentFragmentRoutes = (services: Services): Router => {
  const { prisonPermissionsService, prisonerService } = services

  const router = Router({ mergeParams: true })

  router.use('/', [
    //
    setupCustomHeaderBasedAuthentication,
    setUpCurrentUser(services),
  ])

  // For all routes that contain the prisonNumber path parameter, retrieve the prisoner and check the prisoner is in the user's caseload
  router.param('prisonNumber', retrievePrisonerSummary(prisonerService))
  router.param(
    'prisonNumber',
    prisonerPermissionsGuard(prisonPermissionsService, {
      requestDependentOn: [PrisonerBasePermission.read],
      getPrisonerNumberFunction: (req: Request) => req.params.prisonNumber,
    }),
  )

  router.use('/:prisonNumber/additional-needs', additionalNeedsContentFragmentRoutes(services))

  return router
}

const setupCustomHeaderBasedAuthentication = (req: Request, res: Response, next: NextFunction) => {
  const jwksIssuer = jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    cacheMaxAge: 604800000, // a week
    jwksRequestsPerMinute: 2,
    jwksUri: `${config.apis.hmppsAuth.url}/.well-known/jwks.json`,
  }) as GetVerificationKey

  const token = req.headers['x-user-token'] as string

  expressjwt({
    secret: jwksIssuer,
    issuer: `${config.apis.hmppsAuth.url}/issuer`,
    algorithms: ['RS256'],
    getToken: () => token,
    requestProperty: 'user',
  })(req, res, next).then(() => {
    res.locals.user = {
      ...res.locals.user,
      token,
    }
  })
}

export default setupContentFragmentRoutes
