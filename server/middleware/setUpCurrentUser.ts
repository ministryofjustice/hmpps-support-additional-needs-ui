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
        authorities: roles = [],
      } = jwtDecode(res.locals.user.token) as {
        name?: string
        user_id?: string
        authorities?: string[]
      }

      res.locals.user = {
        ...res.locals.user,
        userId,
        name,
        displayName: convertToTitleCase(name),
        userRoles: roles.map(role => role.substring(role.indexOf('_') + 1)),
      }

      res.locals.userHasPermissionTo = (action: ApplicationAction) => userHasPermissionTo(action, roles)

      if (res.locals.user.authSource === 'nomis') {
        res.locals.user.staffId = parseInt(userId, 10) || undefined

        const { userService } = services
        const userCaseLoadDetail = await userService.getUserCaseLoads(res.locals.user.username, res.locals.user.token)
        res.locals.user.caseLoadIds = userCaseLoadDetail.caseloads.map((caseload: PrisonCaseload) => caseload.id)

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
