import type { ChallengeResponseDto } from 'dto'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import ChallengeService from './challengeService'
import aValidChallengeDto from '../testsupport/challengeDtoTestDataBuilder'
import { aValidCreateChallengesRequest } from '../testsupport/challengeRequestTestDataBuilder'
import { aValidChallengeListResponse, aValidChallengeResponse } from '../testsupport/challengeResponseTestDataBuilder'
import aValidChallengeResponseDto from '../testsupport/challengeResponseDtoTestDataBuilder'

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
      const challengeListResponse = aValidChallengeListResponse({
        challengeResponses: [
          aValidChallengeResponse({
            alnScreenerDate: null,
            fromALNScreener: false,
            symptoms: 'John struggles to read text on white background',
            howIdentifiedOther: 'John was seen to have other challenges',
          }),
        ],
      })
      supportAdditionalNeedsApiClient.getChallenges.mockResolvedValue(challengeListResponse)

      const expectedChallenges = [
        aValidChallengeResponseDto({
          alnScreenerDate: null,
          fromALNScreener: false,
          symptoms: 'John struggles to read text on white background',
          howIdentifiedOther: 'John was seen to have other challenges',
        }),
      ]

      // When
      const actual = await service.getChallenges(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedChallenges)
      expect(supportAdditionalNeedsApiClient.getChallenges).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should return empty Challenges array given API returns null', async () => {
      // Given
      supportAdditionalNeedsApiClient.getChallenges.mockResolvedValue(null)

      const expectedChallenges = [] as Array<ChallengeResponseDto>

      // When
      const actual = await service.getChallenges(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedChallenges)
      expect(supportAdditionalNeedsApiClient.getChallenges).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getChallenges.mockRejectedValue(expectedError)

      // When
      const actual = await service.getChallenges(username, prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getChallenges).toHaveBeenCalledWith(prisonNumber, username)
    })
  })
})
