import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import ChallengeService from './challengeService'
import aValidChallengeDto from '../testsupport/challengeDtoTestDataBuilder'
import { aValidCreateChallengesRequest } from '../testsupport/challengeRequestTestDataBuilder'

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

      supportAdditionalNeedsApiClient.createEducationSupportPlan.mockResolvedValue(null)

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
      const expectedChallenges = [
        {
          challengeId: '1234',
          prisonId: 'BXI',
          prisonNumber: 'A1234BC',
          challengeTypeCode: 'READING_COMPREHENSION',
          symptoms: 'John struggles to read text on white background',
          howIdentified: ['CONVERSATIONS'],
          howIdentifiedOther: 'The trainer noticed that John could read better on a cream background',
          createdBy: 'some-username',
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          challengeId: '5678',
          prisonId: 'BXI',
          prisonNumber: 'A1234BC',
          challengeTypeCode: 'WRITING',
          symptoms: 'Difficulty writing legibly',
          howIdentified: ['OBSERVATIONS'],
          howIdentifiedOther: null,
          createdBy: 'some-username',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ]
      supportAdditionalNeedsApiClient.getChallenges.mockResolvedValue({
        challenges: expectedChallenges,
      })

      // When
      const result = await service.getChallenges(username, 'A1234BC')

      // Then
      expect(supportAdditionalNeedsApiClient.getChallenges).toHaveBeenCalledWith('A1234BC', username)
      expect(result).toHaveLength(2)
      expect(result).toEqual(expectedChallenges)
    })
  })
})
