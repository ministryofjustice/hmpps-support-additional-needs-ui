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
      ]

      // When
      const actual = userWithRoleCan('SOME_NON_SAN_ROLE' as ApplicationRole)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return the actions a user with ROLE_SAN_MANAGER can perform', () => {
      // Given
      const expected = [
        ApplicationAction.SEARCH,
        ApplicationAction.VIEW_PROFILE,
        ApplicationAction.RECORD_EDUCATION_LEARNER_SUPPORT_PLAN,
        ApplicationAction.UPDATE_EDUCATION_LEARNER_SUPPORT_PLAN,
      ]

      // When
      const actual = userWithRoleCan(ApplicationRole.ROLE_SAN_MANAGER)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
