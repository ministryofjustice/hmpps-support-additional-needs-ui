import type { ChallengeResponseDto } from 'dto'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import ChallengeService from './challengeService'
import aValidChallengeDto from '../testsupport/challengeDtoTestDataBuilder'
import { aValidCreateChallengesRequest } from '../testsupport/challengeRequestTestDataBuilder'
import { aValidChallengeListResponse, aValidChallengeResponse } from '../testsupport/challengeResponseTestDataBuilder'
import aValidChallengeResponseDto from '../testsupport/challengeResponseDtoTestDataBuilder'
import ChallengeType from '../enums/challengeType'
import ChallengeIdentificationSource from '../enums/challengeIdentificationSource'
import anUpdateChallengeRequest from '../testsupport/updateChallengeRequestTestDataBuilder'
import anArchiveChallengeRequest from '../testsupport/archiveChallengeRequestTestDataBuilder'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('challengeService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new ChallengeService(supportAdditionalNeedsApiClient)

  const prisonNumber = 'A1234BC'
  const username = 'some-username'
  const challengeReference = '12345678-1234-1234-1234-123456789012'

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

  describe('getChallenge', () => {
    it('should get challenge', async () => {
      // Given
      const challengeResponse = aValidChallengeResponse({
        alnScreenerDate: null,
        fromALNScreener: false,
        symptoms: 'John struggles to read text on white background',
        howIdentifiedOther: 'John was seen to have other challenges',
      })
      supportAdditionalNeedsApiClient.getChallenge.mockResolvedValue(challengeResponse)

      const expectedChallenge = aValidChallengeResponseDto({
        alnScreenerDate: null,
        fromALNScreener: false,
        symptoms: 'John struggles to read text on white background',
        howIdentifiedOther: 'John was seen to have other challenges',
      })

      // When
      const actual = await service.getChallenge(username, prisonNumber, challengeReference)

      // Then
      expect(actual).toEqual(expectedChallenge)
      expect(supportAdditionalNeedsApiClient.getChallenge).toHaveBeenCalledWith(
        prisonNumber,
        challengeReference,
        username,
      )
    })

    it('should return null given API returns null', async () => {
      // Given
      supportAdditionalNeedsApiClient.getChallenge.mockResolvedValue(null)

      const expectedChallenge = null as ChallengeResponseDto

      // When
      const actual = await service.getChallenge(username, prisonNumber, challengeReference)

      // Then
      expect(actual).toEqual(expectedChallenge)
      expect(supportAdditionalNeedsApiClient.getChallenge).toHaveBeenCalledWith(
        prisonNumber,
        challengeReference,
        username,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getChallenge.mockRejectedValue(expectedError)

      // When
      const actual = await service.getChallenge(username, prisonNumber, challengeReference).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getChallenge).toHaveBeenCalledWith(
        prisonNumber,
        challengeReference,
        username,
      )
    })
  })

  describe('updateChallenge', () => {
    it('should update challenge', async () => {
      // Given
      supportAdditionalNeedsApiClient.updateChallenge.mockResolvedValue(null)

      const challengeDto = aValidChallengeDto({
        prisonNumber,
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
      await service.updateChallenge(username, challengeReference, challengeDto)

      // Then
      expect(supportAdditionalNeedsApiClient.updateChallenge).toHaveBeenCalledWith(
        prisonNumber,
        challengeReference,
        username,
        expectedUpdateChallengeRequest,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.updateChallenge.mockRejectedValue(expectedError)

      const challengeDto = aValidChallengeDto({
        prisonNumber,
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
      const actual = await service.updateChallenge(username, challengeReference, challengeDto).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.updateChallenge).toHaveBeenCalledWith(
        prisonNumber,
        challengeReference,
        username,
        expectedUpdateChallengeRequest,
      )
    })
  })

  describe('archiveChallenge', () => {
    it('should archive challenge', async () => {
      // Given
      supportAdditionalNeedsApiClient.archiveChallenge.mockResolvedValue(null)

      const challengeDto = aValidChallengeDto({
        prisonNumber,
        prisonId: 'BXI',
        archiveReason: 'Challenge created in error',
      })

      const expectedArchiveChallengeRequest = anArchiveChallengeRequest({
        prisonId: 'BXI',
        reason: 'Challenge created in error',
      })

      // When
      await service.archiveChallenge(username, challengeReference, challengeDto)

      // Then
      expect(supportAdditionalNeedsApiClient.archiveChallenge).toHaveBeenCalledWith(
        prisonNumber,
        challengeReference,
        username,
        expectedArchiveChallengeRequest,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.archiveChallenge.mockRejectedValue(expectedError)

      const challengeDto = aValidChallengeDto({
        prisonNumber,
        prisonId: 'BXI',
        archiveReason: 'Challenge created in error',
      })

      const expectedArchiveChallengeRequest = anArchiveChallengeRequest({
        prisonId: 'BXI',
        reason: 'Challenge created in error',
      })

      // When
      const actual = await service.archiveChallenge(username, challengeReference, challengeDto).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.archiveChallenge).toHaveBeenCalledWith(
        prisonNumber,
        challengeReference,
        username,
        expectedArchiveChallengeRequest,
      )
    })
  })
})
