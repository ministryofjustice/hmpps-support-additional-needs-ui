import { parseISO } from 'date-fns'
import type { StrengthResponseDto } from 'dto'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import StrengthService from './strengthService'
import { aValidStrengthResponseDto, aValidStrengthsList } from '../testsupport/strengthResponseDtoTestDataBuilder'
import { aValidCreateStrengthsRequest } from '../testsupport/strengthRequestTestDataBuilder'
import { aValidStrengthResponse, aValidStrengthListResponse } from '../testsupport/strengthResponseTestDataBuilder'
import StrengthCategory from '../enums/strengthCategory'
import aValidStrengthDto from '../testsupport/strengthDtoTestDataBuilder'
import StrengthType from '../enums/strengthType'
import StrengthIdentificationSource from '../enums/strengthIdentificationSource'
import anUpdateStrengthRequest from '../testsupport/updateStrengthRequestTestDataBuilder'
import anArchiveStrengthRequest from '../testsupport/archiveStrengthRequestTestDataBuilder'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('strengthService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new StrengthService(supportAdditionalNeedsApiClient)

  const prisonNumber = 'A1234BC'
  const username = 'some-username'
  const strengthReference = '12345678-1234-1234-1234-123456789012'

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
      const strengthListResponse = aValidStrengthListResponse({
        strengths: [aValidStrengthResponse({ fromALNScreener: false, alnScreenerDate: null })],
      })
      supportAdditionalNeedsApiClient.getStrengths.mockResolvedValue(strengthListResponse)

      const expectedStrengthsList = aValidStrengthsList({
        strengths: [
          {
            prisonNumber,
            active: true,
            fromALNScreener: false,
            alnScreenerDate: null,
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

  describe('getStrength', () => {
    it('should get strength', async () => {
      // Given
      const strengthResponse = aValidStrengthResponse({
        alnScreenerDate: null,
        fromALNScreener: false,
        symptoms: 'John can read and understand written language very well',
        howIdentifiedOther: 'John was seen to have other strengths',
      })
      supportAdditionalNeedsApiClient.getStrength.mockResolvedValue(strengthResponse)

      const expectedStrength = aValidStrengthResponseDto({
        alnScreenerDate: null,
        fromALNScreener: false,
        symptoms: 'John can read and understand written language very well',
        howIdentifiedOther: 'John was seen to have other strengths',
      })

      // When
      const actual = await service.getStrength(username, prisonNumber, strengthReference)

      // Then
      expect(actual).toEqual(expectedStrength)
      expect(supportAdditionalNeedsApiClient.getStrength).toHaveBeenCalledWith(
        prisonNumber,
        strengthReference,
        username,
      )
    })

    it('should return null given API returns null', async () => {
      // Given
      supportAdditionalNeedsApiClient.getStrength.mockResolvedValue(null)

      const expectedStrength = null as StrengthResponseDto

      // When
      const actual = await service.getStrength(username, prisonNumber, strengthReference)

      // Then
      expect(actual).toEqual(expectedStrength)
      expect(supportAdditionalNeedsApiClient.getStrength).toHaveBeenCalledWith(
        prisonNumber,
        strengthReference,
        username,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getStrength.mockRejectedValue(expectedError)

      // When
      const actual = await service.getStrength(username, prisonNumber, strengthReference).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getStrength).toHaveBeenCalledWith(
        prisonNumber,
        strengthReference,
        username,
      )
    })
  })

  describe('updateStrength', () => {
    it('should update strength', async () => {
      // Given
      supportAdditionalNeedsApiClient.updateStrength.mockResolvedValue(null)

      const strengthDto = aValidStrengthDto({
        prisonNumber,
        prisonId: 'BXI',
        strengthTypeCode: StrengthType.READING_COMPREHENSION,
        symptoms: 'John can read and understand written language very well',
        howIdentified: [StrengthIdentificationSource.WIDER_PRISON, StrengthIdentificationSource.OTHER],
        howIdentifiedOther: `John's reading strength was discovered during a poetry recital evening`,
      })

      const expectedUpdateStrengthRequest = anUpdateStrengthRequest({
        prisonId: 'BXI',
        symptoms: 'John can read and understand written language very well',
        howIdentified: [StrengthIdentificationSource.WIDER_PRISON, StrengthIdentificationSource.OTHER],
        howIdentifiedOther: `John's reading strength was discovered during a poetry recital evening`,
      })

      // When
      await service.updateStrength(username, strengthReference, strengthDto)

      // Then
      expect(supportAdditionalNeedsApiClient.updateStrength).toHaveBeenCalledWith(
        prisonNumber,
        strengthReference,
        username,
        expectedUpdateStrengthRequest,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.updateStrength.mockRejectedValue(expectedError)

      const strengthDto = aValidStrengthDto({
        prisonNumber,
        prisonId: 'BXI',
        strengthTypeCode: StrengthType.READING_COMPREHENSION,
        symptoms: 'John can read and understand written language very well',
        howIdentified: [StrengthIdentificationSource.WIDER_PRISON, StrengthIdentificationSource.OTHER],
        howIdentifiedOther: `John's reading strength was discovered during a poetry recital evening`,
      })

      const expectedUpdateStrengthRequest = anUpdateStrengthRequest({
        prisonId: 'BXI',
        symptoms: 'John can read and understand written language very well',
        howIdentified: [StrengthIdentificationSource.WIDER_PRISON, StrengthIdentificationSource.OTHER],
        howIdentifiedOther: `John's reading strength was discovered during a poetry recital evening`,
      })

      // When
      const actual = await service.updateStrength(username, strengthReference, strengthDto).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.updateStrength).toHaveBeenCalledWith(
        prisonNumber,
        strengthReference,
        username,
        expectedUpdateStrengthRequest,
      )
    })
  })

  describe('archiveStrength', () => {
    it('should archive strength', async () => {
      // Given
      supportAdditionalNeedsApiClient.archiveStrength.mockResolvedValue(null)

      const strengthDto = aValidStrengthDto({
        prisonNumber,
        prisonId: 'BXI',
        archiveReason: 'Strength created in error',
      })

      const expectedArchiveStrengthRequest = anArchiveStrengthRequest({
        prisonId: 'BXI',
        reason: 'Strength created in error',
      })

      // When
      await service.archiveStrength(username, strengthReference, strengthDto)

      // Then
      expect(supportAdditionalNeedsApiClient.archiveStrength).toHaveBeenCalledWith(
        prisonNumber,
        strengthReference,
        username,
        expectedArchiveStrengthRequest,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.archiveStrength.mockRejectedValue(expectedError)

      const strengthDto = aValidStrengthDto({
        prisonNumber,
        prisonId: 'BXI',
        archiveReason: 'Strength created in error',
      })

      const expectedArchiveStrengthRequest = anArchiveStrengthRequest({
        prisonId: 'BXI',
        reason: 'Strength created in error',
      })

      // When
      const actual = await service.archiveStrength(username, strengthReference, strengthDto).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.archiveStrength).toHaveBeenCalledWith(
        prisonNumber,
        strengthReference,
        username,
        expectedArchiveStrengthRequest,
      )
    })
  })
})
