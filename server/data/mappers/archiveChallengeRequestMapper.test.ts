import aValidChallengeDto from '../../testsupport/challengeDtoTestDataBuilder'
import ChallengeType from '../../enums/challengeType'
import ChallengeIdentificationSource from '../../enums/challengeIdentificationSource'
import anArchiveChallengeRequest from '../../testsupport/archiveChallengeRequestTestDataBuilder'
import toArchiveChallengeRequest from './archiveChallengeRequestMapper'

describe('archiveChallengeRequestMapper', () => {
  describe('toArchiveChallengeRequest', () => {
    it('should map a ChallengeDto to an ArchiveChallengeRequest', () => {
      // Given
      const challengeDto = aValidChallengeDto({
        prisonNumber: 'A1234BC',
        prisonId: 'BXI',
        challengeTypeCode: ChallengeType.READING_COMPREHENSION,
        symptoms: 'John can not read and understand written language very well',
        howIdentified: [ChallengeIdentificationSource.WIDER_PRISON, ChallengeIdentificationSource.OTHER],
        howIdentifiedOther: `John's reading challenge was discovered during a poetry recital evening`,
        archiveReason: 'The challenge was created in error',
      })

      const expectedArchiveChallengeRequest = anArchiveChallengeRequest({
        prisonId: 'BXI',
        reason: 'The challenge was created in error',
      })

      // When
      const actual = toArchiveChallengeRequest(challengeDto)

      // Then
      expect(actual).toEqual(expectedArchiveChallengeRequest)
    })
  })
})
