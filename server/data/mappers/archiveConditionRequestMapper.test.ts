import { aValidConditionDto } from '../../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../../enums/conditionType'
import anArchiveConditionRequest from '../../testsupport/archiveConditionRequestTestDataBuilder'
import toArchiveConditionRequest from './archiveConditionRequestMapper'
import ConditionSource from '../../enums/conditionSource'

describe('archiveConditionRequestMapper', () => {
  describe('toArchiveConditionRequest', () => {
    it('should map a ConditionDto to an ArchiveConditionRequest', () => {
      // Given
      const conditionDto = aValidConditionDto({
        prisonNumber: 'A1234BC',
        prisonId: 'BXI',
        conditionTypeCode: ConditionType.DYSLEXIA,
        conditionName: 'Dyslexia',
        conditionDetails: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
        source: ConditionSource.CONFIRMED_DIAGNOSIS,
        archiveReason: 'The condition was created in error',
      })

      const expectedArchiveConditionRequest = anArchiveConditionRequest({
        prisonId: 'BXI',
        reason: 'The condition was created in error',
      })

      // When
      const actual = toArchiveConditionRequest(conditionDto)

      // Then
      expect(actual).toEqual(expectedArchiveConditionRequest)
    })
  })
})
