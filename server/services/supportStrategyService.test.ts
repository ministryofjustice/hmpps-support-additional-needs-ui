import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import SupportStrategyService from './supportStrategyService'
import aValidSupportStrategyDto from '../testsupport/supportStrategyDtoTestDataBuilder'
import { aValidCreateSupportStrategiesRequest } from '../testsupport/supportStrategyRequestTestDataBuilder'

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
})
