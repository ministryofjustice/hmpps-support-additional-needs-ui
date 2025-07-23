import { startOfToday } from 'date-fns'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import AdditionalLearningNeedsScreenerService from './additionalLearningNeedsScreenerService'
import aValidAlnScreenerDto from '../testsupport/alnScreenerDtoTestDataBuilder'
import ChallengeType from '../enums/challengeType'
import StrengthType from '../enums/strengthType'
import { aValidAlnScreenerRequest } from '../testsupport/alnScreenerRequestTestDataBuilder'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('additionalLearningNeedsScreenerService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new AdditionalLearningNeedsScreenerService(supportAdditionalNeedsApiClient)

  const prisonNumber = 'A1234BC'
  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('recordAlnScreener', () => {
    it('should record ALN Screener', async () => {
      // Given
      const alnScreenerDto = aValidAlnScreenerDto({
        prisonId: 'MDI',
        screenerDate: startOfToday(),
        challenges: [ChallengeType.ARITHMETIC, ChallengeType.NUMBER_RECALL],
        strengths: [StrengthType.READING, StrengthType.LISTENING],
      })
      const expectedAlnScreenerRequest = aValidAlnScreenerRequest({
        prisonId: 'MDI',
        screenerDate: startOfToday(),
        challenges: [
          { challengeTypeCode: ChallengeType.ARITHMETIC },
          { challengeTypeCode: ChallengeType.NUMBER_RECALL },
        ],
        strengths: [{ strengthTypeCode: StrengthType.READING }, { strengthTypeCode: StrengthType.LISTENING }],
      })

      supportAdditionalNeedsApiClient.createAdditionalLearningNeedsScreener.mockResolvedValue(null)

      // When
      await service.recordAlnScreener(username, alnScreenerDto)

      // Then
      expect(supportAdditionalNeedsApiClient.createAdditionalLearningNeedsScreener).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedAlnScreenerRequest,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.createAdditionalLearningNeedsScreener.mockRejectedValue(expectedError)

      const alnScreenerDto = aValidAlnScreenerDto({
        prisonId: 'MDI',
        screenerDate: startOfToday(),
        challenges: [ChallengeType.ARITHMETIC, ChallengeType.NUMBER_RECALL],
        strengths: [StrengthType.READING, StrengthType.LISTENING],
      })
      const expectedAlnScreenerRequest = aValidAlnScreenerRequest({
        prisonId: 'MDI',
        screenerDate: startOfToday(),
        challenges: [
          { challengeTypeCode: ChallengeType.ARITHMETIC },
          { challengeTypeCode: ChallengeType.NUMBER_RECALL },
        ],
        strengths: [{ strengthTypeCode: StrengthType.READING }, { strengthTypeCode: StrengthType.LISTENING }],
      })

      // When
      const actual = await service.recordAlnScreener(username, alnScreenerDto).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.createAdditionalLearningNeedsScreener).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedAlnScreenerRequest,
      )
    })
  })
})
