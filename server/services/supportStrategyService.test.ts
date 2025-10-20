import { parseISO } from 'date-fns'
import type { SupportStrategyResponseDto } from 'dto'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import SupportStrategyService from './supportStrategyService'
import aValidSupportStrategyDto from '../testsupport/supportStrategyDtoTestDataBuilder'
import { aValidCreateSupportStrategiesRequest } from '../testsupport/supportStrategyRequestTestDataBuilder'
import {
  aValidSupportStrategyListResponse,
  aValidSupportStrategyResponse,
} from '../testsupport/supportStrategyResponseTestDataBuilder'
import aValidSupportStrategyResponseDto from '../testsupport/supportStrategyResponseDtoTestDataBuilder'
import SupportStrategyType from '../enums/supportStrategyType'
import SupportStrategyCategory from '../enums/supportStrategyCategory'

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
      const supportStrategiesListResponse = aValidSupportStrategyListResponse({
        supportStrategies: [
          aValidSupportStrategyResponse({
            active: true,
            detail: 'Using flash cards with John can help him retain facts',
            supportStrategyType: 'MEMORY',
            supportStrategyCategory: 'MEMORY',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            createdAt: '2023-06-19T09:39:44Z',
            createdAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: '2023-06-19T09:39:44Z',
            updatedAtPrison: 'MDI',
          }),
        ],
      })
      supportAdditionalNeedsApiClient.getSupportStrategies.mockResolvedValue(supportStrategiesListResponse)

      const expectedSupportStrategies = [
        aValidSupportStrategyResponseDto({
          active: true,
          details: 'Using flash cards with John can help him retain facts',
          supportStrategyCategoryTypeCode: SupportStrategyType.MEMORY,
          supportStrategyCategory: SupportStrategyCategory.MEMORY,
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          createdBy: 'asmith_gen',
          createdByDisplayName: 'Alex Smith',
          createdAt: parseISO('2023-06-19T09:39:44Z'),
          createdAtPrison: 'MDI',
          updatedBy: 'asmith_gen',
          updatedByDisplayName: 'Alex Smith',
          updatedAt: parseISO('2023-06-19T09:39:44Z'),
          updatedAtPrison: 'MDI',
        }),
      ]

      // When
      const actual = await service.getSupportStrategies(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedSupportStrategies)
      expect(supportAdditionalNeedsApiClient.getSupportStrategies).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should return empty array of Support Strategies given API returns null', async () => {
      // Given
      supportAdditionalNeedsApiClient.getSupportStrategies.mockResolvedValue(null)

      const expectedSupportStrategies = [] as Array<SupportStrategyResponseDto>

      // When
      const actual = await service.getSupportStrategies(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedSupportStrategies)
      expect(supportAdditionalNeedsApiClient.getSupportStrategies).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getSupportStrategies.mockRejectedValue(expectedError)

      // When
      const actual = await service.getSupportStrategies(username, prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getSupportStrategies).toHaveBeenCalledWith(prisonNumber, username)
    })
  })
})
