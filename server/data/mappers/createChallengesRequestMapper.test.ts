import { toCreateChallengesRequest } from './createChallengesRequestMapper'
import aValidChallengeDto from '../../testsupport/challengeDtoTestDataBuilder'
import {
  aValidChallengeRequest,
  aValidCreateChallengesRequest,
} from '../../testsupport/challengeRequestTestDataBuilder'
import ChallengeIdentificationSource from '../../enums/challengeIdentificationSource'
import ChallengeType from '../../enums/challengeType'

describe('createChallengesRequestMapper', () => {
  describe('toCreateChallengesRequest', () => {
    it('should map an array of ChallengeDto to a CreateChallengesRequest', () => {
      // Given
      const challenges = [
        aValidChallengeDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          challengeTypeCode: ChallengeType.READING_COMPREHENSION,
          symptoms: 'John struggles to read text on white background',
          howIdentified: [ChallengeIdentificationSource.WIDER_PRISON, ChallengeIdentificationSource.OTHER],
          howIdentifiedOther: 'The trainer noticed that John could read better on a cream background',
        }),
        aValidChallengeDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          challengeTypeCode: ChallengeType.PROBLEM_SOLVING,
          symptoms: 'John struggles to reason about things and solve simple problems',
          howIdentified: [ChallengeIdentificationSource.OTHER],
          howIdentifiedOther: 'It was noticed in class that John struggles with problem solving tasks',
        }),
        aValidChallengeDto({
          prisonNumber: 'A1234BC',
          prisonId: 'BXI',
          challengeTypeCode: ChallengeType.SPEED_OF_CALCULATION,
          symptoms: null,
          howIdentified: [ChallengeIdentificationSource.OTHER_SCREENING_TOOL],
          howIdentifiedOther: null,
        }),
      ]

      const expected = aValidCreateChallengesRequest({
        challenges: [
          aValidChallengeRequest({
            prisonId: 'BXI',
            challengeTypeCode: 'READING_COMPREHENSION',
            symptoms: 'John struggles to read text on white background',
            howIdentified: [ChallengeIdentificationSource.WIDER_PRISON, ChallengeIdentificationSource.OTHER],
            howIdentifiedOther: 'The trainer noticed that John could read better on a cream background',
          }),
          aValidChallengeRequest({
            prisonId: 'BXI',
            challengeTypeCode: 'PROBLEM_SOLVING',
            symptoms: 'John struggles to reason about things and solve simple problems',
            howIdentified: [ChallengeIdentificationSource.OTHER],
            howIdentifiedOther: 'It was noticed in class that John struggles with problem solving tasks',
          }),
          aValidChallengeRequest({
            prisonId: 'BXI',
            challengeTypeCode: 'SPEED_OF_CALCULATION',
            symptoms: null,
            howIdentified: [ChallengeIdentificationSource.OTHER_SCREENING_TOOL],
            howIdentifiedOther: null,
          }),
        ],
      })

      // When
      const actual = toCreateChallengesRequest(challenges)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
