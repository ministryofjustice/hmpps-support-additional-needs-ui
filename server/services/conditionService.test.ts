import { parseISO } from 'date-fns'
import type { ConditionDto } from 'dto'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import ConditionService from './conditionService'
import { aValidConditionDto, aValidConditionsList } from '../testsupport/conditionDtoTestDataBuilder'
import { aValidConditionRequest, aValidCreateConditionsRequest } from '../testsupport/conditionRequestTestDataBuilder'
import { aValidConditionListResponse, aValidConditionResponse } from '../testsupport/conditionResponseTestDataBuilder'
import ConditionType from '../enums/conditionType'
import ConditionSource from '../enums/conditionSource'
import anUpdateConditionRequest from '../testsupport/updateConditionRequestTestDataBuilder'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('conditionService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new ConditionService(supportAdditionalNeedsApiClient)

  const prisonNumber = 'A1234BC'
  const username = 'some-username'
  const conditionReference = '12345678-1234-1234-1234-123456789012'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('createConditions', () => {
    it('should create conditions', async () => {
      // Given
      const unPersistedConditions = aValidConditionsList({ conditions: [aValidConditionDto({ prisonId: 'BXI' })] })
      const expectedCreateConditionsRequest = aValidCreateConditionsRequest({
        conditions: [aValidConditionRequest({ prisonId: 'BXI' })],
      })

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

      const unPersistedConditions = aValidConditionsList({ conditions: [aValidConditionDto({ prisonId: 'BXI' })] })
      const expectedCreateConditionsRequest = aValidCreateConditionsRequest({
        conditions: [aValidConditionRequest({ prisonId: 'BXI' })],
      })

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
            prisonNumber,
            prisonId: null,
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

  describe('getCondition', () => {
    it('should get condition', async () => {
      // Given
      const conditionResponse = aValidConditionResponse({
        conditionTypeCode: ConditionType.DYSLEXIA,
        source: ConditionSource.SELF_DECLARED,
        conditionDetails: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
        conditionName: 'Phonological dyslexia',
      })
      supportAdditionalNeedsApiClient.getCondition.mockResolvedValue(conditionResponse)

      const expectedCondition = aValidConditionDto({
        prisonId: null,
        prisonNumber,
        conditionTypeCode: ConditionType.DYSLEXIA,
        source: ConditionSource.SELF_DECLARED,
        conditionDetails: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
        conditionName: 'Phonological dyslexia',
      })

      // When
      const actual = await service.getCondition(username, prisonNumber, conditionReference)

      // Then
      expect(actual).toEqual(expectedCondition)
      expect(supportAdditionalNeedsApiClient.getCondition).toHaveBeenCalledWith(
        prisonNumber,
        conditionReference,
        username,
      )
    })

    it('should return null given API returns null', async () => {
      // Given
      supportAdditionalNeedsApiClient.getCondition.mockResolvedValue(null)

      const expectedCondition = null as ConditionDto

      // When
      const actual = await service.getCondition(username, prisonNumber, conditionReference)

      // Then
      expect(actual).toEqual(expectedCondition)
      expect(supportAdditionalNeedsApiClient.getCondition).toHaveBeenCalledWith(
        prisonNumber,
        conditionReference,
        username,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getCondition.mockRejectedValue(expectedError)

      // When
      const actual = await service.getCondition(username, prisonNumber, conditionReference).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getCondition).toHaveBeenCalledWith(
        prisonNumber,
        conditionReference,
        username,
      )
    })
  })

  describe('updateCondition', () => {
    it('should update condition', async () => {
      // Given
      supportAdditionalNeedsApiClient.updateCondition.mockResolvedValue(null)

      const conditionDto = aValidConditionDto({
        prisonId: 'BXI',
        conditionTypeCode: ConditionType.DYSLEXIA,
        source: ConditionSource.SELF_DECLARED,
        conditionDetails: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
        conditionName: 'Phonological dyslexia',
      })

      const expectedUpdateConditionRequest = anUpdateConditionRequest({
        prisonId: 'BXI',
        source: ConditionSource.SELF_DECLARED,
        conditionDetails: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
        conditionName: 'Phonological dyslexia',
      })

      // When
      await service.updateCondition(username, conditionReference, conditionDto)

      // Then
      expect(supportAdditionalNeedsApiClient.updateCondition).toHaveBeenCalledWith(
        prisonNumber,
        conditionReference,
        username,
        expectedUpdateConditionRequest,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.updateCondition.mockRejectedValue(expectedError)

      const conditionDto = aValidConditionDto({
        prisonId: 'BXI',
        conditionTypeCode: ConditionType.DYSLEXIA,
        source: ConditionSource.SELF_DECLARED,
        conditionDetails: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
        conditionName: 'Phonological dyslexia',
      })

      const expectedUpdateConditionRequest = anUpdateConditionRequest({
        prisonId: 'BXI',
        source: ConditionSource.SELF_DECLARED,
        conditionDetails: 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
        conditionName: 'Phonological dyslexia',
      })

      // When
      const actual = await service.updateCondition(username, conditionReference, conditionDto).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.updateCondition).toHaveBeenCalledWith(
        prisonNumber,
        conditionReference,
        username,
        expectedUpdateConditionRequest,
      )
    })
  })
})
