import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import ConditionService from './conditionService'
import { aValidConditionsList } from '../testsupport/conditionDtoTestDataBuilder'
import { aValidCreateConditionsRequest } from '../testsupport/conditionRequestTestDataBuilder'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('conditionService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new ConditionService(supportAdditionalNeedsApiClient)

  const prisonNumber = 'A1234BC'
  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('createConditions', () => {
    it('should create conditions', async () => {
      // Given
      const unPersistedConditions = aValidConditionsList()
      const expectedCreateConditionsRequest = aValidCreateConditionsRequest()

      supportAdditionalNeedsApiClient.createConditions.mockResolvedValue(null)

      // When
      await service.createConditions(username, unPersistedConditions)

      // Then
      expect(supportAdditionalNeedsApiClient.createConditions).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedCreateConditionsRequest,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.createConditions.mockRejectedValue(expectedError)

      const unPersistedConditions = aValidConditionsList()
      const expectedCreateConditionsRequest = aValidCreateConditionsRequest()

      // When
      const actual = await service.createConditions(username, unPersistedConditions).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.createConditions).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedCreateConditionsRequest,
      )
    })
  })
})
