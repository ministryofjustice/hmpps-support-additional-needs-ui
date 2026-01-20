import { userWithRoleCan } from './roleBasedAccessControl'
import DpsRole from '../enums/dpsRole'
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
      const actual = userWithRoleCan('SOME_NON_SAN_ROLE' as DpsRole)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return the actions a user with ROLE_SAN_EDUCATION_MANAGER can perform', () => {
      // Given
      const expected = [
        ApplicationAction.SEARCH,
        ApplicationAction.VIEW_PROFILE,
        ApplicationAction.RECORD_EDUCATION_LEARNER_SUPPORT_PLAN,
        ApplicationAction.RECORD_DECLINED_EDUCATION_LEARNER_SUPPORT_PLAN,
        ApplicationAction.REVIEW_EDUCATION_LEARNER_SUPPORT_PLAN,
        ApplicationAction.UPDATE_EDUCATION_LEARNER_SUPPORT_PLAN,
        ApplicationAction.RECORD_CHALLENGES,
        ApplicationAction.RECORD_STRENGTHS,
        ApplicationAction.RECORD_SUPPORT_STRATEGIES,
        ApplicationAction.RECORD_SELF_DECLARED_CONDITIONS,
        ApplicationAction.RECORD_DIAGNOSED_CONDITIONS,
        ApplicationAction.RECORD_ALN_SCREENER,
        ApplicationAction.VIEW_ELSP_DEADLINES_AND_STATUSES_ON_PROFILE,
        ApplicationAction.VIEW_ELSP_DEADLINES_AND_STATUSES_ON_SEARCH,
        ApplicationAction.EDIT_CONDITIONS,
        ApplicationAction.ARCHIVE_CONDITIONS,
        ApplicationAction.EDIT_STRENGTHS,
        ApplicationAction.ARCHIVE_STRENGTHS,
        ApplicationAction.EDIT_CHALLENGES,
        ApplicationAction.ARCHIVE_CHALLENGES,
        ApplicationAction.EDIT_SUPPORT_STRATEGIES,
        ApplicationAction.ARCHIVE_SUPPORT_STRATEGIES,
        ApplicationAction.VIEW_SAN_DPR_REPORT,
      ]

      // When
      const actual = userWithRoleCan(DpsRole.ROLE_SAN_EDUCATION_MANAGER)

      // Then
      expect(actual.sort()).toEqual(expected.sort())
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
        ApplicationAction.VIEW_ELSP_DEADLINES_AND_STATUSES_ON_PROFILE,
        ApplicationAction.VIEW_ELSP_DEADLINES_AND_STATUSES_ON_SEARCH,
        ApplicationAction.EDIT_CONDITIONS,
        ApplicationAction.ARCHIVE_CONDITIONS,
        ApplicationAction.EDIT_STRENGTHS,
        ApplicationAction.ARCHIVE_STRENGTHS,
        ApplicationAction.EDIT_CHALLENGES,
        ApplicationAction.ARCHIVE_CHALLENGES,
        ApplicationAction.EDIT_SUPPORT_STRATEGIES,
        ApplicationAction.ARCHIVE_SUPPORT_STRATEGIES,
        ApplicationAction.VIEW_SAN_DPR_REPORT,
      ]

      // When
      const actual = userWithRoleCan(DpsRole.ROLE_SAN_EDITOR)

      // Then
      expect(actual.sort()).toEqual(expected.sort())
    })
  })
})
