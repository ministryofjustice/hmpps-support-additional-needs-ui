import authorisationMiddleware from './authorisationMiddleware'
import DpsRole from '../enums/dpsRole'
import ApplicationAction from '../enums/applicationAction'

/**
 * A map of [ApplicationAction] to [DpsRole]s, to determine which role is required for any given action.
 * The list of [DpsRole]s should be considered an "or" list. Users require any one of the listed roles for each
 * action.
 */
const rolesForAction = (): Record<ApplicationAction, Array<DpsRole>> => ({
  [ApplicationAction.SEARCH]: [],
  [ApplicationAction.VIEW_PROFILE]: [],
  [ApplicationAction.RECORD_EDUCATION_LEARNER_SUPPORT_PLAN]: [DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.RECORD_DECLINED_EDUCATION_LEARNER_SUPPORT_PLAN]: [DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.REVIEW_EDUCATION_LEARNER_SUPPORT_PLAN]: [DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.UPDATE_EDUCATION_LEARNER_SUPPORT_PLAN]: [DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.RECORD_CHALLENGES]: [],
  [ApplicationAction.EDIT_CHALLENGES]: [DpsRole.ROLE_SAN_EDITOR, DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.ARCHIVE_CHALLENGES]: [DpsRole.ROLE_SAN_EDITOR, DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.RECORD_STRENGTHS]: [],
  [ApplicationAction.EDIT_STRENGTHS]: [DpsRole.ROLE_SAN_EDITOR, DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.ARCHIVE_STRENGTHS]: [DpsRole.ROLE_SAN_EDITOR, DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.RECORD_SUPPORT_STRATEGIES]: [],
  [ApplicationAction.EDIT_SUPPORT_STRATEGIES]: [DpsRole.ROLE_SAN_EDITOR, DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.ARCHIVE_SUPPORT_STRATEGIES]: [DpsRole.ROLE_SAN_EDITOR, DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.RECORD_SELF_DECLARED_CONDITIONS]: [],
  [ApplicationAction.RECORD_DIAGNOSED_CONDITIONS]: [DpsRole.ROLE_SAN_EDITOR, DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.EDIT_CONDITIONS]: [DpsRole.ROLE_SAN_EDITOR, DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.ARCHIVE_CONDITIONS]: [DpsRole.ROLE_SAN_EDITOR, DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.RECORD_ALN_SCREENER]: [],
  [ApplicationAction.VIEW_ELSP_DEADLINES_AND_STATUSES_ON_PROFILE]: [
    DpsRole.ROLE_SAN_EDITOR,
    DpsRole.ROLE_SAN_EDUCATION_MANAGER,
  ],
  [ApplicationAction.VIEW_ELSP_DEADLINES_AND_STATUSES_ON_SEARCH]: [
    DpsRole.ROLE_SAN_EDITOR,
    DpsRole.ROLE_SAN_EDUCATION_MANAGER,
  ],
  [ApplicationAction.VIEW_SAN_DPR_REPORT]: [DpsRole.ROLE_SAN_EDITOR, DpsRole.ROLE_SAN_EDUCATION_MANAGER],
  [ApplicationAction.USE_DPR_REPORTING_SERVICE]: [DpsRole.ROLE_PRISONS_REPORTING_USER],
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
  return requiredRoles.length === 0 || userRoles.some(role => requiredRoles.includes(role as DpsRole))
}

/**
 * Helper method to return an array of [ApplicationAction] for a given [DpsRole] that a user might have.
 */
const userWithRoleCan = (role: DpsRole): Array<ApplicationAction> =>
  Object.keys(ApplicationAction)
    .filter(
      action =>
        rolesForAction()[action as ApplicationAction].length === 0 ||
        rolesForAction()[action as ApplicationAction].includes(role),
    )
    .map(action => action as ApplicationAction)

export { checkUserHasPermissionTo, userHasPermissionTo, userWithRoleCan }
