import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import ChallengeService from './challengeService'
import aValidChallengeDto from '../testsupport/challengeDtoTestDataBuilder'
import { aValidCreateChallengesRequest } from '../testsupport/challengeRequestTestDataBuilder'
import { aValidChallengeListResponse, aValidChallengeResponse } from '../testsupport/challengeResponseTestDataBuilder'
import toChallengeDto from '../data/mappers/challengeDtoMapper'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('challengeService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new ChallengeService(supportAdditionalNeedsApiClient)

  const prisonNumber = 'A1234BC'
  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('createChallenges', () => {
    it('should create challenges', async () => {
      // Given
      const unPersistedChallengeDtos = [aValidChallengeDto()]
      const expectedCreateChallengesRequest = aValidCreateChallengesRequest()

      supportAdditionalNeedsApiClient.createChallenges.mockResolvedValue(null)

      // When
      await service.createChallenges(username, unPersistedChallengeDtos)

      // Then
      expect(supportAdditionalNeedsApiClient.createChallenges).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedCreateChallengesRequest,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.createChallenges.mockRejectedValue(expectedError)

      const unPersistedChallengeDtos = [aValidChallengeDto()]
      const expectedCreateChallengesRequest = aValidCreateChallengesRequest()

      // When
      const actual = await service.createChallenges(username, unPersistedChallengeDtos).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.createChallenges).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedCreateChallengesRequest,
      )
    })
  })
  describe('getChallenges', () => {
    it('should get challenges', async () => {
      // Given
      supportAdditionalNeedsApiClient.createEducationSupportPlan.mockResolvedValue(null)
      aValidChallengeResponse()
      aValidChallengeDto()
      const expectedChallengeListResponse = aValidChallengeListResponse()

      supportAdditionalNeedsApiClient.getChallenges.mockResolvedValue(expectedChallengeListResponse)

      // When
      const result = await service.getChallenges(username, 'A1234BC')

      // Then
      expect(supportAdditionalNeedsApiClient.getChallenges).toHaveBeenCalledWith('A1234BC', username)
      expect(result).toHaveLength(1)
      expect(result).toEqual(toChallengeDto(prisonNumber, expectedChallengeListResponse))
    })
  })
})
