import { toCreateConditionsRequest } from './createConditionsRequestMapper'
import aValidConditionDto from '../../testsupport/conditionDtoTestDataBuilder'
import {
  aValidConditionRequest,
  aValidCreateConditionsRequest,
} from '../../testsupport/conditionRequestTestDataBuilder'
import ConditionSource from '../../enums/conditionSource'

describe('createConditionsRequestMapper', () => {
  describe('toCreateConditionsRequest', () => {
    it('should map an array of ConditionDto to a CreateConditionsRequest', () => {
      // Given
      const conditions = [
        aValidConditionDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          conditionTypeCode: 'DYSLEXIA',
          source: ConditionSource.SELF_DECLARED,
          detail: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
        }),
        aValidConditionDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          conditionTypeCode: 'DYSCALCULIA',
          source: ConditionSource.SELF_DECLARED,
          detail:
            'John struggles with numeracy and feels he has this condition, though has not been seen by a medical professional about it',
        }),
        aValidConditionDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          conditionTypeCode: 'ADHD',
          source: ConditionSource.CONFIRMED_DIAGNOSIS,
          detail: null,
        }),
      ]

      const expected = aValidCreateConditionsRequest({
        conditions: [
          aValidConditionRequest({
            prisonId: 'BXI',
            conditionTypeCode: 'DYSLEXIA',
            source: ConditionSource.SELF_DECLARED,
            detail: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
          }),
          aValidConditionRequest({
            prisonId: 'BXI',
            conditionTypeCode: 'DYSCALCULIA',
            source: ConditionSource.SELF_DECLARED,
            detail:
              'John struggles with numeracy and feels he has this condition, though has not been seen by a medical professional about it',
          }),
          aValidConditionRequest({
            prisonId: 'BXI',
            conditionTypeCode: 'ADHD',
            source: ConditionSource.CONFIRMED_DIAGNOSIS,
            detail: null,
          }),
        ],
      })

      // When
      const actual = toCreateConditionsRequest(conditions)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
