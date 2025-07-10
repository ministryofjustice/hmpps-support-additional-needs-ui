import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import ConditionService from './conditionService'
import aValidConditionDto from '../testsupport/conditionDtoTestDataBuilder'
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
      const unPersistedConditionDtos = [aValidConditionDto()]
      const expectedCreateConditionsRequest = aValidCreateConditionsRequest()

      supportAdditionalNeedsApiClient.createEducationSupportPlan.mockResolvedValue(null)

      // When
      await service.createConditions(username, unPersistedConditionDtos)

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

      const unPersistedConditionDtos = [aValidConditionDto()]
      const expectedCreateConditionsRequest = aValidCreateConditionsRequest()

      // When
      const actual = await service.createConditions(username, unPersistedConditionDtos).catch(e => e)

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
