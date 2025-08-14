import authorisationMiddleware from './authorisationMiddleware'
import ApplicationRole from '../enums/applicationRole'
import ApplicationAction from '../enums/applicationAction'

/**
 * A map of [ApplicationAction] to [ApplicationRole]s, to determine which role is required for any given action.
 * The list of [ApplicationRole]s should be considered an "or" list. Users require any one of the listed roles for each
 * action.
 */
const rolesForAction = (): Record<ApplicationAction, Array<ApplicationRole>> => ({
  [ApplicationAction.SEARCH]: [],
  [ApplicationAction.VIEW_PROFILE]: [],
  [ApplicationAction.RECORD_EDUCATION_LEARNER_SUPPORT_PLAN]: [ApplicationRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.RECORD_CHALLENGES]: [],
  [ApplicationAction.RECORD_STRENGTHS]: [],
  [ApplicationAction.RECORD_SUPPORT_STRATEGIES]: [],
  [ApplicationAction.RECORD_SELF_DECLARED_CONDITIONS]: [],
  [ApplicationAction.RECORD_DIAGNOSED_CONDITIONS]: [
    ApplicationRole.ROLE_SAN_EDITOR,
    ApplicationRole.ROLE_SAN_EDUCATION_MANAGER,
  ],
})

/**
 * A convenience middleware function that uses [authorisationMiddleware] to grant or deny access to a given
 * [ApplicationAction] based on the user's roles.
 */
const checkUserHasPermissionTo = (action: ApplicationAction) => authorisationMiddleware(rolesForAction()[action])

/**
 * Returns true if the specified [ApplicationAction] can be satisfied with any of the specified user roles.
 */
const userHasPermissionTo = (action: ApplicationAction, userRoles: string[]): boolean => {
  const requiredRoles = rolesForAction()[action]
  return requiredRoles.length === 0 || userRoles.some(role => requiredRoles.includes(role as ApplicationRole))
}

/**
 * Helper method to return an array of [ApplicationAction] for a given [ApplicationRole] that a user might have.
 */
const userWithRoleCan = (role: ApplicationRole): Array<ApplicationAction> =>
  Object.keys(ApplicationAction)
    .filter(
      action =>
        rolesForAction()[action as ApplicationAction].length === 0 ||
        rolesForAction()[action as ApplicationAction].includes(role),
    )
    .map(action => action as ApplicationAction)

export { checkUserHasPermissionTo, userHasPermissionTo, userWithRoleCan }
