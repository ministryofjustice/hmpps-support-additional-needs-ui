import { toCreateConditionsRequest } from './createConditionsRequestMapper'
import aValidConditionDto from '../../testsupport/conditionDtoTestDataBuilder'
import {
  aValidConditionRequest,
  aValidCreateConditionsRequest,
} from '../../testsupport/conditionRequestTestDataBuilder'
import ConditionSource from '../../enums/conditionSource'
import ConditionType from '../../enums/conditionType'

describe('createConditionsRequestMapper', () => {
  describe('toCreateConditionsRequest', () => {
    it('should map an array of ConditionDto to a CreateConditionsRequest', () => {
      // Given
      const conditions = [
        aValidConditionDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          conditionTypeCode: ConditionType.DYSLEXIA,
          source: ConditionSource.SELF_DECLARED,
          conditionDetails: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
          conditionName: 'Phonological dyslexia',
        }),
        aValidConditionDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          conditionTypeCode: ConditionType.DYSCALCULIA,
          source: ConditionSource.SELF_DECLARED,
          conditionDetails:
            'John struggles with numeracy and feels he has this condition, though has not been seen by a medical professional about it',
          conditionName: null,
        }),
        aValidConditionDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          conditionTypeCode: ConditionType.ADHD,
          source: ConditionSource.CONFIRMED_DIAGNOSIS,
          conditionDetails: 'John has difficulty paying attention and is generally hyperactive and impulsive.',
          conditionName: null,
        }),
      ]

      const expected = aValidCreateConditionsRequest({
        conditions: [
          aValidConditionRequest({
            prisonId: 'BXI',
            conditionTypeCode: 'DYSLEXIA',
            source: ConditionSource.SELF_DECLARED,
            conditionDetails:
              'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
            conditionName: 'Phonological dyslexia',
          }),
          aValidConditionRequest({
            prisonId: 'BXI',
            conditionTypeCode: 'DYSCALCULIA',
            source: ConditionSource.SELF_DECLARED,
            conditionDetails:
              'John struggles with numeracy and feels he has this condition, though has not been seen by a medical professional about it',
            conditionName: null,
          }),
          aValidConditionRequest({
            prisonId: 'BXI',
            conditionTypeCode: 'ADHD',
            source: ConditionSource.CONFIRMED_DIAGNOSIS,
            conditionDetails: 'John has difficulty paying attention and is generally hyperactive and impulsive.',
            conditionName: null,
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
