import aValidStrengthDto from '../../testsupport/strengthDtoTestDataBuilder'
import StrengthType from '../../enums/strengthType'
import StrengthIdentificationSource from '../../enums/strengthIdentificationSource'
import anUpdateStrengthRequest from '../../testsupport/updateStrengthRequestTestDataBuilder'
import toUpdateStrengthRequest from './updateStrengthRequestMapper'

describe('updateStrengthRequestMapper', () => {
  describe('toUpdateStrengthRequest', () => {
    it('should map a StrengthDto to an UpdateStrengthRequest', () => {
      // Given
      const strengthDto = aValidStrengthDto({
        prisonNumber: 'A1234BC',
        prisonId: 'BXI',
        strengthTypeCode: StrengthType.READING_COMPREHENSION,
        symptoms: 'John can read and understand written language very well',
        howIdentified: [StrengthIdentificationSource.WIDER_PRISON, StrengthIdentificationSource.OTHER],
        howIdentifiedOther: `John's reading strength was discovered during a poetry recital evening`,
      })

      const expectedUpdateStrengthRequest = anUpdateStrengthRequest({
        prisonId: 'BXI',
        symptoms: 'John can read and understand written language very well',
        howIdentified: [StrengthIdentificationSource.WIDER_PRISON, StrengthIdentificationSource.OTHER],
        howIdentifiedOther: `John's reading strength was discovered during a poetry recital evening`,
      })

      // When
      const actual = toUpdateStrengthRequest(strengthDto)

      // Then
      expect(actual).toEqual(expectedUpdateStrengthRequest)
    })
  })
})
