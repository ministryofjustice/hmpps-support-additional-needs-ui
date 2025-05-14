import { userWithRoleCan } from './roleBasedAccessControl'
import ApplicationRole from '../enums/applicationRole'
import ApplicationAction from '../enums/applicationAction'

describe('roleBasedAccessControl', () => {
  describe('userWithRoleCan', () => {
    it('should return the actions a user with ROLE_SAN_MANAGER can perform', () => {
      // Given
      const expected = [
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
