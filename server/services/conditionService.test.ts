import { parseISO } from 'date-fns'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import ConditionService from './conditionService'
import { aValidConditionsList } from '../testsupport/conditionDtoTestDataBuilder'
import { aValidCreateConditionsRequest } from '../testsupport/conditionRequestTestDataBuilder'
import { aValidConditionListResponse } from '../testsupport/conditionResponseTestDataBuilder'
import ConditionType from '../enums/conditionType'
import ConditionSource from '../enums/conditionSource'

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

  describe('getConditions', () => {
    it('should get conditions', async () => {
      // Given
      const conditionListResponse = aValidConditionListResponse()
      supportAdditionalNeedsApiClient.getConditions.mockResolvedValue(conditionListResponse)

      const expectedConditionsList = aValidConditionsList({
        conditions: [
          {
            active: true,
            conditionDetails:
              'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
            conditionName: 'Phonological dyslexia',
            conditionTypeCode: ConditionType.DYSLEXIA,
            createdAt: parseISO('2023-06-19T09:39:44Z'),
            createdAtPrison: 'MDI',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            source: ConditionSource.SELF_DECLARED,
            updatedAt: parseISO('2023-06-19T09:39:44Z'),
            updatedAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
        ],
      })

      // When
      const actual = await service.getConditions(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedConditionsList)
      expect(supportAdditionalNeedsApiClient.getConditions).toHaveBeenCalledWith(prisonNumber, username)
    })
  })

  it('should return empty ConditionsList given API returns null', async () => {
    // Given
    supportAdditionalNeedsApiClient.getConditions.mockResolvedValue(null)

    const expectedConditionsList = aValidConditionsList({
      prisonNumber,
      conditions: [],
    })

    // When
    const actual = await service.getConditions(username, prisonNumber)

    // Then
    expect(actual).toEqual(expectedConditionsList)
    expect(supportAdditionalNeedsApiClient.getConditions).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should rethrow error given API client throws error', async () => {
    // Given
    const expectedError = new Error('Internal Server Error')
    supportAdditionalNeedsApiClient.getConditions.mockRejectedValue(expectedError)

    // When
    const actual = await service.getConditions(username, prisonNumber).catch(e => e)

    // Then
    expect(actual).toEqual(expectedError)
    expect(supportAdditionalNeedsApiClient.getConditions).toHaveBeenCalledWith(prisonNumber, username)
  })
})
