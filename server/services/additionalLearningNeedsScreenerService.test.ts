import { format, startOfToday } from 'date-fns'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import AdditionalLearningNeedsScreenerService from './additionalLearningNeedsScreenerService'
import {
  aValidAlnScreenerDto,
  aValidAlnScreenerList,
  aValidAlnScreenerResponseDto,
} from '../testsupport/alnScreenerDtoTestDataBuilder'
import ChallengeType from '../enums/challengeType'
import challengeType from '../enums/challengeType'
import StrengthType from '../enums/strengthType'
import { aValidAlnScreenerRequest } from '../testsupport/alnScreenerRequestTestDataBuilder'
import { aValidAlnScreenerResponse, aValidAlnScreeners } from '../testsupport/alnScreenerResponseTestDataBuilder'
import { aValidChallengeResponse } from '../testsupport/challengeResponseTestDataBuilder'
import { aValidStrengthResponse } from '../testsupport/strengthResponseTestDataBuilder'
import ChallengeCategory from '../enums/challengeCategory'
import StrengthCategory from '../enums/strengthCategory'
import { aValidStrengthResponseDto } from '../testsupport/strengthResponseDtoTestDataBuilder'
import aValidChallengeResponseDto from '../testsupport/challengeResponseDtoTestDataBuilder'
import ChallengeIdentificationSource from '../enums/challengeIdentificationSource'

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

  describe('getAlnScreeners', () => {
    it.skip('should get ALN Screeners', async () => {
      // Given
      const screenerDate = startOfToday()
      const challenge = aValidChallengeResponse({
        symptoms: 'John struggles to read text on white background',
        fromALNScreener: true,
        challengeTypeCode: 'LITERACY_SKILLS_DEFAULT',
        howIdentified: ChallengeIdentificationSource.CONVERSATIONS,
        alnScreenerDate: format(screenerDate, 'yyyy-MM-dd'),
      })
      challenge.challengeType.categoryCode = 'LITERACY_SKILLS'
      challenge.howIdentifiedOther = '123'

      const strength = aValidStrengthResponse({
        fromALNScreener: true,
        alnScreenerDate: format(screenerDate, 'yyyy-MM-dd'),
      })
      strength.strengthType.code = 'NUMERACY_SKILLS_DEFAULT'
      strength.strengthType.categoryCode = 'NUMERACY_SKILLS'

      const alnScreeners = aValidAlnScreeners({
        screeners: [
          aValidAlnScreenerResponse({
            screenerDate: format(screenerDate, 'yyyy-MM-dd'),
            challenges: [challenge],
            strengths: [strength],
          }),
        ],
      })
      supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners.mockResolvedValue(alnScreeners)
      const expectedChallengeResponseDto = aValidChallengeResponseDto({
        challengeTypeCode: challengeType.LITERACY_SKILLS_DEFAULT,
        challengeCategory: ChallengeCategory.LITERACY_SKILLS,
        symptoms: 'John struggles to read text on white background',
        howIdentified: [ChallengeIdentificationSource.CONVERSATIONS],
        howIdentifiedOther: '123',
        alnScreenerDate: screenerDate,
      })
      expectedChallengeResponseDto.challengeType = { code: 'LITERACY_SKILLS_DEFAULT', areaCode: undefined }

      const expectedAlnScreenerList = aValidAlnScreenerList({
        prisonNumber,
        screeners: [
          aValidAlnScreenerResponseDto({
            screenerDate,
            challenges: [expectedChallengeResponseDto],
            strengths: [
              aValidStrengthResponseDto({
                strengthTypeCode: StrengthType.NUMERACY_SKILLS_DEFAULT,
                strengthCategory: StrengthCategory.NUMERACY_SKILLS,
                fromALNScreener: true,
                alnScreenerDate: screenerDate,
              }),
            ],
          }),
        ],
      })
      // When
      const actual = await service.getAlnScreeners(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedAlnScreenerList)
      expect(supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners).toHaveBeenCalledWith(
        prisonNumber,
        username,
      )
    })

    it('should return empty AlnScreenerList given API returns null', async () => {
      // Given
      supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners.mockResolvedValue(null)

      const expectedAlnScreenerList = aValidAlnScreenerList({
        prisonNumber,
        screeners: [],
      })

      // When
      const actual = await service.getAlnScreeners(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedAlnScreenerList)
      expect(supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners).toHaveBeenCalledWith(
        prisonNumber,
        username,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners.mockRejectedValue(expectedError)

      // When
      const actual = await service.getAlnScreeners(username, prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners).toHaveBeenCalledWith(
        prisonNumber,
        username,
      )
    })
  })
})
