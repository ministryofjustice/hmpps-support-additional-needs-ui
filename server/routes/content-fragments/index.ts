import { NextFunction, Request, Response, Router } from 'express'
import jwksRsa from 'jwks-rsa'
import { expressjwt, GetVerificationKey } from 'express-jwt'
import { Services } from '../../services'
import config from '../../config'

/**
 * Setup the routes used for returning content fragments
 *
 * Content fragments are small fragments of page markup that can be injected into other services. For example, Prisoner
 * Profile uses a fragment served from that contains the marked up SAN data for the prisoner.
 * This approach means that SAN is responsible for calling it's own API and for processing the data into a small
 * nunjucks template.
 *
 * This setup MUST happen before the main call to the setUpAuthentication middleware as it uses the X-USER-TOKEN header
 * to carry the user token.
 */
const setupContentFragmentRoutes = (_services: Services): Router => {
  const router = Router({ mergeParams: true })

  router.use('/', setupCustomHeaderBasedAuthentication)

  router.use('/additional-needs/:prisonNumber', async (req: Request, res: Response, next: NextFunction) => {
    const { prisonNumber } = req.params
    res.send(`<h1>Prisoner's additional needs for ${prisonNumber}</h1>`)
  })

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

  expressjwt({
    secret: jwksIssuer,
    issuer: `${config.apis.hmppsAuth.url}/issuer`,
    algorithms: ['RS256'],
    getToken: reqInternal => reqInternal.headers['x-user-token'] as string,
  })(req, res, next)
}

export default setupContentFragmentRoutes
