import aValidChallengeDto from '../../testsupport/challengeDtoTestDataBuilder'
import ChallengeType from '../../enums/challengeType'
import ChallengeIdentificationSource from '../../enums/challengeIdentificationSource'
import anUpdateChallengeRequest from '../../testsupport/updateChallengeRequestTestDataBuilder'
import toUpdateChallengeRequest from './updateChallengeRequestMapper'

describe('updateChallengeRequestMapper', () => {
  describe('toUpdateChallengeRequest', () => {
    it('should map a ChallengeDto to an UpdateChallengeRequest', () => {
      // Given
      const challengeDto = aValidChallengeDto({
        prisonNumber: 'A1234BC',
        prisonId: 'BXI',
        challengeTypeCode: ChallengeType.READING_COMPREHENSION,
        symptoms: 'John struggles to read text on white background',
        howIdentified: [ChallengeIdentificationSource.WIDER_PRISON, ChallengeIdentificationSource.OTHER],
        howIdentifiedOther: 'The trainer noticed that John could read better on a cream background',
      })

      const expectedUpdateChallengeRequest = anUpdateChallengeRequest({
        prisonId: 'BXI',
        symptoms: 'John struggles to read text on white background',
        howIdentified: [ChallengeIdentificationSource.WIDER_PRISON, ChallengeIdentificationSource.OTHER],
        howIdentifiedOther: 'The trainer noticed that John could read better on a cream background',
      })

      // When
      const actual = toUpdateChallengeRequest(challengeDto)

      // Then
      expect(actual).toEqual(expectedUpdateChallengeRequest)
    })
  })
})
