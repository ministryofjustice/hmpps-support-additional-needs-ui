import { toCreateConditionsRequest } from './createConditionsRequestMapper'
import { aValidConditionDto, aValidConditionsList } from '../../testsupport/conditionDtoTestDataBuilder'
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
      const conditionsList = aValidConditionsList({
        prisonNumber: 'A1234BC',
        conditions: [
          aValidConditionDto({
            prisonId: 'BXI',
            conditionTypeCode: ConditionType.DYSLEXIA,
            source: ConditionSource.SELF_DECLARED,
            conditionDetails:
              'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
            conditionName: 'Phonological dyslexia',
          }),
          aValidConditionDto({
            prisonId: 'BXI',
            conditionTypeCode: ConditionType.DYSCALCULIA,
            source: ConditionSource.SELF_DECLARED,
            conditionDetails:
              'John struggles with numeracy and feels he has this condition, though has not been seen by a medical professional about it',
            conditionName: null,
          }),
          aValidConditionDto({
            prisonId: 'BXI',
            conditionTypeCode: ConditionType.ADHD,
            source: ConditionSource.CONFIRMED_DIAGNOSIS,
            conditionDetails: 'John has difficulty paying attention and is generally hyperactive and impulsive.',
            conditionName: null,
          }),
        ],
      })

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
      const actual = toCreateConditionsRequest(conditionsList)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
