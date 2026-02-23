import { jwtDecode } from 'jwt-decode'
import { Router } from 'express'
import type { PrisonCaseload } from 'manageUsersApiClient'
import { convertToTitleCase } from '../utils/utils'
import logger from '../../logger'
import ApplicationAction from '../enums/applicationAction'
import { userHasPermissionTo } from './roleBasedAccessControl'
import { Services } from '../services'

export default function setUpCurrentUser(services: Services): Router {
  const router = Router({ mergeParams: true })

  router.use(async (req, res, next) => {
    try {
      const {
        name,
        user_id: userId,
        user_name: username,
        auth_source: authSource,
        authorities: roles = [],
      } = jwtDecode(res.locals.user.token) as {
        name?: string
        user_id?: string
        user_name?: string
        auth_source?: 'nomis' | 'delius' | 'external' | 'azuread'
        authorities?: string[]
      }

      res.locals.user = {
        ...res.locals.user,
        userId,
        name,
        authSource: authSource as never,
        username,
        displayName: convertToTitleCase(name),
        userRoles: roles.map(role => role.substring(role.indexOf('_') + 1)),
      }

      res.locals.userHasPermissionTo = (action: ApplicationAction) => userHasPermissionTo(action, roles)

      if (res.locals.user.authSource === 'nomis') {
        res.locals.user.staffId = parseInt(userId, 10) || undefined

        const { userService } = services
        const userCaseLoadDetail = await userService.getUserCaseLoads(res.locals.user.token)
        res.locals.user.caseLoads = userCaseLoadDetail.caseloads.map((caseload: PrisonCaseload) => ({
          caseLoadId: caseload.id,
        }))

        if (userCaseLoadDetail.activeCaseload) {
          res.locals.user.activeCaseLoadId = userCaseLoadDetail.activeCaseload.id
        }
      }

      next()
    } catch (error) {
      logger.error(error, `Failed to populate user details for: ${res.locals.user && res.locals.user.username}`)
      next(error)
    }
  })

  return router
}
