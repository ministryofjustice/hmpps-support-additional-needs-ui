import { parseISO } from 'date-fns'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import StrengthService from './strengthService'
import { aValidStrengthDto, aValidStrengthsList } from '../testsupport/strengthDtoTestDataBuilder'
import { aValidCreateStrengthsRequest } from '../testsupport/strengthRequestTestDataBuilder'
import { aValidStrengthListResponse } from '../testsupport/strengthResponseTestDataBuilder'
import StrengthType from '../enums/strengthType'
import StrengthIdentificationSource from '../enums/strengthIdentificationSource'
import StrengthCategory from '../enums/strengthCategory'

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

      supportAdditionalNeedsApiClient.createStrengths.mockResolvedValue(null)

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

  describe('getStrengths', () => {
    it('should get strengths', async () => {
      // Given
      const strengthListResponse = aValidStrengthListResponse()
      supportAdditionalNeedsApiClient.getStrengths.mockResolvedValue(strengthListResponse)

      const expectedStrengthsList = aValidStrengthsList({
        strengths: [
          {
            active: true,
            fromALNScreener: true,
            symptoms: 'John can read and understand written language very well',
            strengthTypeCode: StrengthType.READING_COMPREHENSION,
            strengthCategory: StrengthCategory.LITERACY_SKILLS,
            howIdentified: [StrengthIdentificationSource.CONVERSATIONS],
            howIdentifiedOther: `John's reading strength was discovered during a poetry recital evening`,
            createdAt: parseISO('2023-06-19T09:39:44Z'),
            createdAtPrison: 'MDI',
            createdBy: 'asmith_gen',
            createdByDisplayName: 'Alex Smith',
            reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
            updatedAt: parseISO('2023-06-19T09:39:44Z'),
            updatedAtPrison: 'MDI',
            updatedBy: 'asmith_gen',
            updatedByDisplayName: 'Alex Smith',
          },
        ],
      })

      // When
      const actual = await service.getStrengths(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedStrengthsList)
      expect(supportAdditionalNeedsApiClient.getStrengths).toHaveBeenCalledWith(prisonNumber, username)
    })
  })

  it('should return empty StrengthsList given API returns null', async () => {
    // Given
    supportAdditionalNeedsApiClient.getStrengths.mockResolvedValue(null)

    const expectedStrengthsList = aValidStrengthsList({
      prisonNumber,
      strengths: [],
    })

    // When
    const actual = await service.getStrengths(username, prisonNumber)

    // Then
    expect(actual).toEqual(expectedStrengthsList)
    expect(supportAdditionalNeedsApiClient.getStrengths).toHaveBeenCalledWith(prisonNumber, username)
  })

  it('should rethrow error given API client throws error', async () => {
    // Given
    const expectedError = new Error('Internal Server Error')
    supportAdditionalNeedsApiClient.getStrengths.mockRejectedValue(expectedError)

    // When
    const actual = await service.getStrengths(username, prisonNumber).catch(e => e)

    // Then
    expect(actual).toEqual(expectedError)
    expect(supportAdditionalNeedsApiClient.getStrengths).toHaveBeenCalledWith(prisonNumber, username)
  })
})
