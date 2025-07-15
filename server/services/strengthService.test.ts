import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import StrengthService from './strengthService'
import aValidStrengthDto from '../testsupport/strengthDtoTestDataBuilder'
import { aValidCreateStrengthsRequest } from '../testsupport/strengthRequestTestDataBuilder'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('strengthService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new StrengthService(supportAdditionalNeedsApiClient)

  const prisonNumber = 'A1234BC'
  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('createStrengths', () => {
    it('should create strengths', async () => {
      // Given
      const unPersistedStrengthDtos = [aValidStrengthDto()]
      const expectedCreateStrengthsRequest = aValidCreateStrengthsRequest()

      supportAdditionalNeedsApiClient.createEducationSupportPlan.mockResolvedValue(null)

      // When
      await service.createStrengths(username, unPersistedStrengthDtos)

      // Then
      expect(supportAdditionalNeedsApiClient.createStrengths).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedCreateStrengthsRequest,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.createStrengths.mockRejectedValue(expectedError)

      const unPersistedStrengthDtos = [aValidStrengthDto()]
      const expectedCreateStrengthsRequest = aValidCreateStrengthsRequest()

      // When
      const actual = await service.createStrengths(username, unPersistedStrengthDtos).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.createStrengths).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedCreateStrengthsRequest,
      )
    })
  })
})
