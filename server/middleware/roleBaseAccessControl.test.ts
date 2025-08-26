import { userWithRoleCan } from './roleBasedAccessControl'
import ApplicationRole from '../enums/applicationRole'
import ApplicationAction from '../enums/applicationAction'

describe('roleBasedAccessControl', () => {
  describe('userWithRoleCan', () => {
    it('should return the actions that a user without any specific SAN roles can perform', () => {
      // Given
      const expected = [
        //
        ApplicationAction.SEARCH,
        ApplicationAction.VIEW_PROFILE,
        ApplicationAction.RECORD_CHALLENGES,
        ApplicationAction.RECORD_STRENGTHS,
        ApplicationAction.RECORD_SUPPORT_STRATEGIES,
        ApplicationAction.RECORD_SELF_DECLARED_CONDITIONS,
        ApplicationAction.RECORD_ALN_SCREENER,
      ]

      // When
      const actual = userWithRoleCan('SOME_NON_SAN_ROLE' as ApplicationRole)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return the actions a user with ROLE_SAN_EDUCATION_MANAGER can perform', () => {
      // Given
      const expected = [
        ApplicationAction.SEARCH,
        ApplicationAction.VIEW_PROFILE,
        ApplicationAction.RECORD_EDUCATION_LEARNER_SUPPORT_PLAN,
        ApplicationAction.RECORD_CHALLENGES,
        ApplicationAction.RECORD_STRENGTHS,
        ApplicationAction.RECORD_SUPPORT_STRATEGIES,
        ApplicationAction.RECORD_SELF_DECLARED_CONDITIONS,
        ApplicationAction.RECORD_DIAGNOSED_CONDITIONS,
        ApplicationAction.RECORD_ALN_SCREENER,
      ]

      // When
      const actual = userWithRoleCan(ApplicationRole.ROLE_SAN_EDUCATION_MANAGER)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return the actions a user with ROLE_SAN_EDITOR can perform', () => {
      // Given
      const expected = [
        ApplicationAction.SEARCH,
        ApplicationAction.VIEW_PROFILE,
        ApplicationAction.RECORD_CHALLENGES,
        ApplicationAction.RECORD_STRENGTHS,
        ApplicationAction.RECORD_SUPPORT_STRATEGIES,
        ApplicationAction.RECORD_SELF_DECLARED_CONDITIONS,
        ApplicationAction.RECORD_DIAGNOSED_CONDITIONS,
        ApplicationAction.RECORD_ALN_SCREENER,
      ]

      // When
      const actual = userWithRoleCan(ApplicationRole.ROLE_SAN_EDITOR)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
