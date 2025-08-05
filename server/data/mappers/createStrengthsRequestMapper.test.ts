import { toCreateStrengthsRequest } from './createStrengthsRequestMapper'
import { aValidStrengthDto } from '../../testsupport/strengthDtoTestDataBuilder'
import { aValidCreateStrengthsRequest, aValidStrengthRequest } from '../../testsupport/strengthRequestTestDataBuilder'
import StrengthIdentificationSource from '../../enums/strengthIdentificationSource'
import StrengthType from '../../enums/strengthType'

describe('createStrengthsRequestMapper', () => {
  describe('toCreateStrengthsRequest', () => {
    it('should map an array of StrengthDto to a CreateStrengthsRequest', () => {
      // Given
      const strengths = [
        aValidStrengthDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          strengthTypeCode: StrengthType.READING_COMPREHENSION,
          symptoms: 'John struggles to read text on white background',
          howIdentified: [StrengthIdentificationSource.WIDER_PRISON, StrengthIdentificationSource.OTHER],
          howIdentifiedOther: 'The trainer noticed that John could read better on a cream background',
        }),
        aValidStrengthDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          strengthTypeCode: StrengthType.PROBLEM_SOLVING,
          symptoms: 'John struggles to reason about things and solve simple problems',
          howIdentified: [StrengthIdentificationSource.OTHER],
          howIdentifiedOther: 'It was noticed in class that John struggles with problem solving tasks',
        }),
        aValidStrengthDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          strengthTypeCode: StrengthType.SPEED_OF_CALCULATION,
          symptoms: null,
          howIdentified: [StrengthIdentificationSource.OTHER_SCREENING_TOOL],
          howIdentifiedOther: null,
        }),
      ]

      const expected = aValidCreateStrengthsRequest({
        strengths: [
          aValidStrengthRequest({
            prisonId: 'BXI',
            strengthTypeCode: 'READING_COMPREHENSION',
            symptoms: 'John struggles to read text on white background',
            howIdentified: [StrengthIdentificationSource.WIDER_PRISON, StrengthIdentificationSource.OTHER],
            howIdentifiedOther: 'The trainer noticed that John could read better on a cream background',
          }),
          aValidStrengthRequest({
            prisonId: 'BXI',
            strengthTypeCode: 'PROBLEM_SOLVING',
            symptoms: 'John struggles to reason about things and solve simple problems',
            howIdentified: [StrengthIdentificationSource.OTHER],
            howIdentifiedOther: 'It was noticed in class that John struggles with problem solving tasks',
          }),
          aValidStrengthRequest({
            prisonId: 'BXI',
            strengthTypeCode: 'SPEED_OF_CALCULATION',
            symptoms: null,
            howIdentified: [StrengthIdentificationSource.OTHER_SCREENING_TOOL],
            howIdentifiedOther: null,
          }),
        ],
      })

      // When
      const actual = toCreateStrengthsRequest(strengths)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
