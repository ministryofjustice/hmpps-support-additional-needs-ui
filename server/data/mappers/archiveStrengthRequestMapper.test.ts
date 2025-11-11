import aValidStrengthDto from '../../testsupport/strengthDtoTestDataBuilder'
import StrengthType from '../../enums/strengthType'
import StrengthIdentificationSource from '../../enums/strengthIdentificationSource'
import anArchiveStrengthRequest from '../../testsupport/archiveStrengthRequestTestDataBuilder'
import toArchiveStrengthRequest from './archiveStrengthRequestMapper'

describe('archiveStrengthRequestMapper', () => {
  describe('toArchiveStrengthRequest', () => {
    it('should map a StrengthDto to an ArchiveStrengthRequest', () => {
      // Given
      const strengthDto = aValidStrengthDto({
        prisonNumber: 'A1234BC',
        prisonId: 'BXI',
        strengthTypeCode: StrengthType.READING_COMPREHENSION,
        symptoms: 'John can read and understand written language very well',
        howIdentified: [StrengthIdentificationSource.WIDER_PRISON, StrengthIdentificationSource.OTHER],
        howIdentifiedOther: `John's reading strength was discovered during a poetry recital evening`,
        archiveReason: 'The strength was created in error',
      })

      const expectedArchiveStrengthRequest = anArchiveStrengthRequest({
        prisonId: 'BXI',
        reason: 'The strength was created in error',
      })

      // When
      const actual = toArchiveStrengthRequest(strengthDto)

      // Then
      expect(actual).toEqual(expectedArchiveStrengthRequest)
    })
  })
})
