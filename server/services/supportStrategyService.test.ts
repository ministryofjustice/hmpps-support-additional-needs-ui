import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import SupportStrategyService from './supportStrategyService'
import aValidSupportStrategyDto from '../testsupport/supportStrategyDtoTestDataBuilder'
import { aValidCreateSupportStrategiesRequest } from '../testsupport/supportStrategyRequestTestDataBuilder'
import { aValidSupportStrategyListResponse } from '../testsupport/supportStrategyResponseTestDataBuilder'
import { toSupportStrategyResponseDtos } from '../data/mappers/supportStrategyResponseDtoMapper'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('supportStrategyService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new SupportStrategyService(supportAdditionalNeedsApiClient)

  const prisonNumber = 'A1234BC'
  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('createSupportStrategies', () => {
    it('should create supportStrategies', async () => {
      // Given
      const unPersistedSupportStrategyDtos = [aValidSupportStrategyDto()]
      const expectedCreateSupportStrategiesRequest = aValidCreateSupportStrategiesRequest()

      supportAdditionalNeedsApiClient.createSupportStrategies.mockResolvedValue(null)

      // When
      await service.createSupportStrategies(username, unPersistedSupportStrategyDtos)

      // Then
      expect(supportAdditionalNeedsApiClient.createSupportStrategies).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedCreateSupportStrategiesRequest,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.createSupportStrategies.mockRejectedValue(expectedError)

      const unPersistedSupportStrategyDtos = [aValidSupportStrategyDto()]
      const expectedCreateSupportStrategiesRequest = aValidCreateSupportStrategiesRequest()

      // When
      const actual = await service.createSupportStrategies(username, unPersistedSupportStrategyDtos).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.createSupportStrategies).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedCreateSupportStrategiesRequest,
      )
    })
  })
  describe('getSupportStrategies', () => {
    it('should get support strategies', async () => {
      // Given
      supportAdditionalNeedsApiClient.createEducationSupportPlan.mockResolvedValue(null)
      const expectedSupportStrategyListResponse = aValidSupportStrategyListResponse()

      supportAdditionalNeedsApiClient.getSupportStrategies.mockResolvedValue(expectedSupportStrategyListResponse)

      // When
      const result = await service.getSupportStrategies(username, 'A1234BC')

      // Then
      expect(supportAdditionalNeedsApiClient.getSupportStrategies).toHaveBeenCalledWith('A1234BC', username)
      expect(result).toHaveLength(1)
      expect(result).toEqual(toSupportStrategyResponseDtos(expectedSupportStrategyListResponse))
    })
  })
})
