import type { ReferenceDataItemDto } from 'dto'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import ReferenceDataService from './referenceDataService'
import ReferenceDataDomain from '../enums/referenceDataDomain'
import {
  aValidChallengeReferenceData,
  aValidConditionReferenceData,
  aValidReferenceDataListResponse,
  aValidStrengthReferenceData,
} from '../testsupport/referenceDataResponseTestDataBuilder'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('referenceDataService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new ReferenceDataService(supportAdditionalNeedsApiClient)

  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getConditions', () => {
    it('should get conditions reference data', async () => {
      // Given
      const apiResponse = aValidReferenceDataListResponse({
        referenceDataList: [
          aValidConditionReferenceData({
            code: 'DYSLEXIA',
            categoryCode: 'LEARNING_DIFFICULTY',
          }),
        ],
      })
      supportAdditionalNeedsApiClient.getReferenceData.mockResolvedValue(apiResponse)

      const expected: Record<string, Array<ReferenceDataItemDto>> = {
        LEARNING_DIFFICULTY: [{ code: 'DYSLEXIA', areaCode: undefined }],
      }

      // When
      const actual = await service.getConditions(username)

      // Then
      expect(actual).toEqual(expected)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CONDITION,
        { categoriesOnly: false, includeInactive: false },
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getReferenceData.mockRejectedValue(expectedError)

      // When
      const actual = await service.getConditions(username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CONDITION,
        { categoriesOnly: false, includeInactive: false },
      )
    })
  })

  describe('getChallenges', () => {
    it('should get challenges reference data', async () => {
      // Given
      const apiResponse = aValidReferenceDataListResponse({
        referenceDataList: [
          aValidChallengeReferenceData({
            code: 'ALPHABET_ORDERING',
            categoryCode: 'LITERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          }),
        ],
      })
      supportAdditionalNeedsApiClient.getReferenceData.mockResolvedValue(apiResponse)

      const expected: Record<string, Array<ReferenceDataItemDto>> = {
        LITERACY_SKILLS: [{ code: 'ALPHABET_ORDERING', areaCode: 'COGNITION_LEARNING' }],
      }

      // When
      const actual = await service.getChallenges(username)

      // Then
      expect(actual).toEqual(expected)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CHALLENGE,
        { categoriesOnly: false, includeInactive: false },
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getReferenceData.mockRejectedValue(expectedError)

      // When
      const actual = await service.getChallenges(username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CHALLENGE,
        { categoriesOnly: false, includeInactive: false },
      )
    })
  })

  describe('getChallengeCategories', () => {
    it('should get challenge categories reference data', async () => {
      // Given
      const apiResponse = aValidReferenceDataListResponse({
        referenceDataList: [
          aValidChallengeReferenceData({
            code: 'LITERACY_SKILLS_DEFAULT',
            categoryCode: 'LITERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          }),
        ],
      })
      supportAdditionalNeedsApiClient.getReferenceData.mockResolvedValue(apiResponse)

      const expected: Array<ReferenceDataItemDto> = [
        { code: 'LITERACY_SKILLS_DEFAULT', areaCode: 'COGNITION_LEARNING' },
      ]

      // When
      const actual = await service.getChallengeCategories(username)

      // Then
      expect(actual).toEqual(expected)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CHALLENGE,
        { categoriesOnly: true, includeInactive: false },
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getReferenceData.mockRejectedValue(expectedError)

      // When
      const actual = await service.getChallengeCategories(username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CHALLENGE,
        { categoriesOnly: true, includeInactive: false },
      )
    })
  })

  describe('getStrengths', () => {
    it('should get strengths reference data', async () => {
      // Given
      const apiResponse = aValidReferenceDataListResponse({
        referenceDataList: [
          aValidStrengthReferenceData({
            code: 'HANDWRITING',
            categoryCode: 'PHYSICAL_SKILLS',
            areaCode: 'PHYSICAL_SENSORY',
          }),
        ],
      })
      supportAdditionalNeedsApiClient.getReferenceData.mockResolvedValue(apiResponse)

      const expected: Record<string, Array<ReferenceDataItemDto>> = {
        PHYSICAL_SKILLS: [{ code: 'HANDWRITING', areaCode: 'PHYSICAL_SENSORY' }],
      }

      // When
      const actual = await service.getStrengths(username)

      // Then
      expect(actual).toEqual(expected)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.STRENGTH,
        { categoriesOnly: false, includeInactive: false },
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getReferenceData.mockRejectedValue(expectedError)

      // When
      const actual = await service.getStrengths(username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.STRENGTH,
        { categoriesOnly: false, includeInactive: false },
      )
    })
  })

  describe('getStrengthCategories', () => {
    it('should get strength categories reference data', async () => {
      // Given
      const apiResponse = aValidReferenceDataListResponse({
        referenceDataList: [
          aValidStrengthReferenceData({
            code: 'EMOTIONS_FEELINGS_DEFAULT',
            categoryCode: 'EMOTIONS_FEELINGS',
            areaCode: 'SOCIAL_EMOTIONAL_MENTAL',
          }),
        ],
      })
      supportAdditionalNeedsApiClient.getReferenceData.mockResolvedValue(apiResponse)

      const expected: Array<ReferenceDataItemDto> = [
        { code: 'EMOTIONS_FEELINGS_DEFAULT', areaCode: 'SOCIAL_EMOTIONAL_MENTAL' },
      ]

      // When
      const actual = await service.getStrengthCategories(username)

      // Then
      expect(actual).toEqual(expected)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.STRENGTH,
        { categoriesOnly: true, includeInactive: false },
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getReferenceData.mockRejectedValue(expectedError)

      // When
      const actual = await service.getStrengthCategories(username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.STRENGTH,
        { categoriesOnly: true, includeInactive: false },
      )
    })
  })
})
