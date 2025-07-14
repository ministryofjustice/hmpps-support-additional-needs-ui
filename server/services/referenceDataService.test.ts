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
import RedisReferenceDataStore from '../data/referenceDataStore/redisReferenceDataStore'

jest.mock('../data/referenceDataStore/redisReferenceDataStore')
jest.mock('../data/supportAdditionalNeedsApiClient')

describe('referenceDataService', () => {
  const referenceDataStore = new RedisReferenceDataStore(null) as jest.Mocked<RedisReferenceDataStore>
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new ReferenceDataService(referenceDataStore, supportAdditionalNeedsApiClient)

  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getConditions', () => {
    it('should get and cache conditions reference data given ref data not in cache and API returns the ref data', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)

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
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.CONDITION, false, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CONDITION,
        { categoriesOnly: false, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).toHaveBeenCalledWith(
        ReferenceDataDomain.CONDITION,
        false,
        false,
        apiResponse,
        24,
      )
    })

    it('should get and cache conditions reference data given ref data not in cache and API returns the ref data and saving in cache returns an error', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)
      referenceDataStore.setReferenceData.mockRejectedValue(Error('some error caching the reference data'))

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
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.CONDITION, false, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CONDITION,
        { categoriesOnly: false, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).toHaveBeenCalledWith(
        ReferenceDataDomain.CONDITION,
        false,
        false,
        apiResponse,
        24,
      )
    })

    it('should get conditions reference data given ref data is in the cache', async () => {
      // Given
      const apiResponse = aValidReferenceDataListResponse({
        referenceDataList: [
          aValidConditionReferenceData({
            code: 'DYSLEXIA',
            categoryCode: 'LEARNING_DIFFICULTY',
          }),
        ],
      })
      referenceDataStore.getReferenceData.mockResolvedValue(apiResponse)

      const expected: Record<string, Array<ReferenceDataItemDto>> = {
        LEARNING_DIFFICULTY: [{ code: 'DYSLEXIA', areaCode: undefined }],
      }

      // When
      const actual = await service.getConditions(username)

      // Then
      expect(actual).toEqual(expected)
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.CONDITION, false, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).not.toHaveBeenCalled()
      expect(referenceDataStore.setReferenceData).not.toHaveBeenCalled()
    })

    it('should not get conditions reference data given ref data is not in the cache and API returns an error', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)

      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getReferenceData.mockRejectedValue(expectedError)

      // When
      const actual = await service.getConditions(username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.CONDITION, false, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CONDITION,
        { categoriesOnly: false, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).not.toHaveBeenCalled()
    })
  })

  describe('getChallenges', () => {
    it('should get and cache challenges reference data given ref data not in cache and API returns the ref data', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)

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
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.CHALLENGE, false, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CHALLENGE,
        { categoriesOnly: false, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).toHaveBeenCalledWith(
        ReferenceDataDomain.CHALLENGE,
        false,
        false,
        apiResponse,
        24,
      )
    })

    it('should get and cache challenges reference data given ref data not in cache and API returns the ref data and saving in cache returns an error', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)
      referenceDataStore.setReferenceData.mockRejectedValue(Error('some error caching the reference data'))

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
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.CHALLENGE, false, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CHALLENGE,
        { categoriesOnly: false, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).toHaveBeenCalledWith(
        ReferenceDataDomain.CHALLENGE,
        false,
        false,
        apiResponse,
        24,
      )
    })

    it('should get challenges reference data given ref data is in the cache', async () => {
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
      referenceDataStore.getReferenceData.mockResolvedValue(apiResponse)

      const expected: Record<string, Array<ReferenceDataItemDto>> = {
        LITERACY_SKILLS: [{ code: 'ALPHABET_ORDERING', areaCode: 'COGNITION_LEARNING' }],
      }

      // When
      const actual = await service.getChallenges(username)

      // Then
      expect(actual).toEqual(expected)
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.CHALLENGE, false, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).not.toHaveBeenCalled()
      expect(referenceDataStore.setReferenceData).not.toHaveBeenCalled()
    })

    it('should not get challenge reference data given ref data is not in the cache and API returns an error', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)

      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getReferenceData.mockRejectedValue(expectedError)

      // When
      const actual = await service.getChallenges(username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.CHALLENGE, false, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CHALLENGE,
        { categoriesOnly: false, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).not.toHaveBeenCalled()
    })
  })

  describe('getChallengeCategories', () => {
    it('should get and cache challenge categories reference data given ref data not in cache and API returns the ref data', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)

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
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.CHALLENGE, true, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CHALLENGE,
        { categoriesOnly: true, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).toHaveBeenCalledWith(
        ReferenceDataDomain.CHALLENGE,
        true,
        false,
        apiResponse,
        24,
      )
    })

    it('should get and cache challenge categories reference data given ref data not in cache and API returns the ref data and saving in cache returns an error', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)
      referenceDataStore.setReferenceData.mockRejectedValue(Error('some error caching the reference data'))

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
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.CHALLENGE, true, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CHALLENGE,
        { categoriesOnly: true, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).toHaveBeenCalledWith(
        ReferenceDataDomain.CHALLENGE,
        true,
        false,
        apiResponse,
        24,
      )
    })

    it('should get challenge categories reference data given ref data is in the cache', async () => {
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
      referenceDataStore.getReferenceData.mockResolvedValue(apiResponse)

      const expected: Array<ReferenceDataItemDto> = [
        { code: 'LITERACY_SKILLS_DEFAULT', areaCode: 'COGNITION_LEARNING' },
      ]

      // When
      const actual = await service.getChallengeCategories(username)

      // Then
      expect(actual).toEqual(expected)
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.CHALLENGE, true, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).not.toHaveBeenCalled()
      expect(referenceDataStore.setReferenceData).not.toHaveBeenCalled()
    })

    it('should not get challenge categories reference data given ref data is not in the cache and API returns an error', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)

      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getReferenceData.mockRejectedValue(expectedError)

      // When
      const actual = await service.getChallengeCategories(username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.CHALLENGE, true, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.CHALLENGE,
        { categoriesOnly: true, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).not.toHaveBeenCalled()
    })
  })

  describe('getStrengths', () => {
    it('should get and cache strengths reference data given ref data not in cache and API returns the ref data', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)

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
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.STRENGTH, false, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.STRENGTH,
        { categoriesOnly: false, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).toHaveBeenCalledWith(
        ReferenceDataDomain.STRENGTH,
        false,
        false,
        apiResponse,
        24,
      )
    })

    it('should get and cache strengths reference data given ref data not in cache and API returns the ref data and saving in cache returns an error', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)
      referenceDataStore.setReferenceData.mockRejectedValue(Error('some error caching the reference data'))

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
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.STRENGTH, false, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.STRENGTH,
        { categoriesOnly: false, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).toHaveBeenCalledWith(
        ReferenceDataDomain.STRENGTH,
        false,
        false,
        apiResponse,
        24,
      )
    })

    it('should get strengths reference data given ref data is in the cache', async () => {
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
      referenceDataStore.getReferenceData.mockResolvedValue(apiResponse)

      const expected: Record<string, Array<ReferenceDataItemDto>> = {
        PHYSICAL_SKILLS: [{ code: 'HANDWRITING', areaCode: 'PHYSICAL_SENSORY' }],
      }

      // When
      const actual = await service.getStrengths(username)

      // Then
      expect(actual).toEqual(expected)
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.STRENGTH, false, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).not.toHaveBeenCalled()
      expect(referenceDataStore.setReferenceData).not.toHaveBeenCalled()
    })

    it('should not get strengths reference data given ref data is not in the cache and API returns an error', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)

      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getReferenceData.mockRejectedValue(expectedError)

      // When
      const actual = await service.getStrengths(username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.STRENGTH, false, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.STRENGTH,
        { categoriesOnly: false, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).not.toHaveBeenCalled()
    })
  })

  describe('getStrengthCategories', () => {
    it('should get and cache strength categories reference data given ref data not in cache and API returns the ref data', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)

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
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.STRENGTH, true, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.STRENGTH,
        { categoriesOnly: true, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).toHaveBeenCalledWith(
        ReferenceDataDomain.STRENGTH,
        true,
        false,
        apiResponse,
        24,
      )
    })

    it('should get and cache strength categories reference data given ref data not in cache and API returns the ref data and saving in cache returns an error', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)
      referenceDataStore.setReferenceData.mockRejectedValue(Error('some error caching the reference data'))

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
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.STRENGTH, true, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.STRENGTH,
        { categoriesOnly: true, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).toHaveBeenCalledWith(
        ReferenceDataDomain.STRENGTH,
        true,
        false,
        apiResponse,
        24,
      )
    })

    it('should get strength categories reference data given ref data is in the cache', async () => {
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
      referenceDataStore.getReferenceData.mockResolvedValue(apiResponse)

      const expected: Array<ReferenceDataItemDto> = [
        { code: 'EMOTIONS_FEELINGS_DEFAULT', areaCode: 'SOCIAL_EMOTIONAL_MENTAL' },
      ]

      // When
      const actual = await service.getStrengthCategories(username)

      // Then
      expect(actual).toEqual(expected)
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.STRENGTH, true, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).not.toHaveBeenCalled()
      expect(referenceDataStore.setReferenceData).not.toHaveBeenCalled()
    })

    it('should not get strength categories reference data given ref data is not in the cache and API returns an error', async () => {
      // Given
      referenceDataStore.getReferenceData.mockResolvedValue(null)

      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getReferenceData.mockRejectedValue(expectedError)

      // When
      const actual = await service.getStrengthCategories(username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(referenceDataStore.getReferenceData).toHaveBeenCalledWith(ReferenceDataDomain.STRENGTH, true, false)
      expect(supportAdditionalNeedsApiClient.getReferenceData).toHaveBeenCalledWith(
        username,
        ReferenceDataDomain.STRENGTH,
        { categoriesOnly: true, includeInactive: false },
      )
      expect(referenceDataStore.setReferenceData).not.toHaveBeenCalled()
    })
  })
})
