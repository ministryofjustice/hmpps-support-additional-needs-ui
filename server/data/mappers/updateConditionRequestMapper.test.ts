import { aValidConditionDto } from '../../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../../enums/conditionType'
import anUpdateConditionRequest from '../../testsupport/updateConditionRequestTestDataBuilder'
import toUpdateConditionRequest from './updateConditionRequestMapper'
import ConditionSource from '../../enums/conditionSource'

describe('updateConditionRequestMapper', () => {
  describe('toUpdateConditionRequest', () => {
    it('should map a ConditionDto to an UpdateConditionRequest', () => {
      // Given
      const conditionDto = aValidConditionDto({
        prisonId: 'BXI',
        conditionTypeCode: ConditionType.DYSLEXIA,
        source: ConditionSource.SELF_DECLARED,
        conditionDetails: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
        conditionName: 'Phonological dyslexia',
      })

      const expectedUpdateConditionRequest = anUpdateConditionRequest({
        prisonId: 'BXI',
        source: ConditionSource.SELF_DECLARED,
        conditionDetails: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
        conditionName: 'Phonological dyslexia',
      })

      // When
      const actual = toUpdateConditionRequest(conditionDto)

      // Then
      expect(actual).toEqual(expectedUpdateConditionRequest)
    })
  })
})
