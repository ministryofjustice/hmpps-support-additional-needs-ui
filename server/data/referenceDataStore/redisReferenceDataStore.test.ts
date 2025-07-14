import type { ReferenceDataItemDto } from 'dto'
import RedisReferenceDataStore from './redisReferenceDataStore'
import ReferenceDataStore from './referenceDataStore'
import { RedisClient } from '../redisClient'
import ReferenceDataDomain from '../../enums/referenceDataDomain'

describe('redisReferenceDataStore', () => {
  const redisClient = {
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    connect: jest.fn(),
  }

  const referenceDataStore: ReferenceDataStore = new RedisReferenceDataStore(redisClient as unknown as RedisClient)

  const referenceData: Record<string, Array<ReferenceDataItemDto>> = {
    LITERACY_SKILLS: [
      { areaCode: 'COGNITION_LEARNING', code: 'READING' },
      { areaCode: 'COGNITION_LEARNING', code: 'SPELLING' },
    ],
    NUMERACY_SKILLS: [
      { areaCode: 'COGNITION_LEARNING', code: 'SPEED_OF_CALCULATION' },
      { areaCode: 'COGNITION_LEARNING', code: 'ARITHMETIC' },
    ],
  }

  const referenceDataCategories: Array<ReferenceDataItemDto> = [
    { areaCode: 'COGNITION_LEARNING', code: 'LITERACY_SKILLS_DEFAULT' },
    { areaCode: 'COGNITION_LEARNING', code: 'NUMERACY_SKILLS_DEFAULT' },
  ]

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('reference data', () => {
    it('should set reference data', async () => {
      // Given
      const durationHours = 2

      // When
      await referenceDataStore.setReferenceData(ReferenceDataDomain.CHALLENGE, false, referenceData, durationHours)

      // Then
      expect(redisClient.set).toHaveBeenCalledWith(
        'referenceData.CHALLENGE.excludesInactive',
        JSON.stringify(referenceData),
        { EX: 7200 }, // 2 hours in seconds
      )
    })

    it('should get reference data given redis client returns reference data', async () => {
      // Given
      const serializedReferenceData = JSON.stringify(referenceData)
      redisClient.get.mockResolvedValue(serializedReferenceData)

      // When
      const returnedReferenceData = await referenceDataStore.getReferenceData(ReferenceDataDomain.CHALLENGE, true)

      // Then
      expect(returnedReferenceData).toEqual(referenceData)
      expect(redisClient.get).toHaveBeenCalledWith('referenceData.CHALLENGE.includesInactive')
    })

    it('should get undefined given reference data not in redis', async () => {
      // Given
      const serializedReferenceData: string = null
      redisClient.get.mockResolvedValue(serializedReferenceData)

      // When
      const returnedReferenceData = await referenceDataStore.getReferenceData(ReferenceDataDomain.STRENGTH, false)

      // Then
      expect(returnedReferenceData).toBeUndefined()
      expect(redisClient.get).toHaveBeenCalledWith('referenceData.STRENGTH.excludesInactive')
    })

    it('should not get reference data given redis client throws an error', async () => {
      // Given
      redisClient.get.mockRejectedValue('some error')

      // When
      try {
        await referenceDataStore.getReferenceData(ReferenceDataDomain.CONDITION, false)
      } catch (error) {
        // Then
        expect(error).toBe('some error')
        expect(redisClient.get).toHaveBeenCalledWith('referenceData.CONDITION.excludesInactive')
      }
    })
  })

  describe('reference data categories', () => {
    it('should set reference data categories', async () => {
      // Given
      const durationHours = 2

      // When
      await referenceDataStore.setReferenceDataCategories(
        ReferenceDataDomain.CHALLENGE,
        false,
        referenceDataCategories,
        durationHours,
      )

      // Then
      expect(redisClient.set).toHaveBeenCalledWith(
        'referenceDataCategories.CHALLENGE.excludesInactive',
        JSON.stringify(referenceDataCategories),
        { EX: 7200 }, // 2 hours in seconds
      )
    })

    it('should get reference data categories given redis client returns reference data categories', async () => {
      // Given
      const serializedReferenceDataCategories = JSON.stringify(referenceDataCategories)
      redisClient.get.mockResolvedValue(serializedReferenceDataCategories)

      // When
      const returnedReferenceDataCategories = await referenceDataStore.getReferenceDataCategories(
        ReferenceDataDomain.CHALLENGE,
        true,
      )

      // Then
      expect(returnedReferenceDataCategories).toEqual(referenceDataCategories)
      expect(redisClient.get).toHaveBeenCalledWith('referenceDataCategories.CHALLENGE.includesInactive')
    })

    it('should get undefined given reference data categories not in redis', async () => {
      // Given
      const serializedReferenceDataCategories: string = null
      redisClient.get.mockResolvedValue(serializedReferenceDataCategories)

      // When
      const returnedReferenceDataCategories = await referenceDataStore.getReferenceDataCategories(
        ReferenceDataDomain.STRENGTH,
        false,
      )

      // Then
      expect(returnedReferenceDataCategories).toBeUndefined()
      expect(redisClient.get).toHaveBeenCalledWith('referenceDataCategories.STRENGTH.excludesInactive')
    })

    it('should not get reference data categories given redis client throws an error', async () => {
      // Given
      redisClient.get.mockRejectedValue('some error')

      // When
      try {
        await referenceDataStore.getReferenceDataCategories(ReferenceDataDomain.CONDITION, false)
      } catch (error) {
        // Then
        expect(error).toBe('some error')
        expect(redisClient.get).toHaveBeenCalledWith('referenceDataCategories.CONDITION.excludesInactive')
      }
    })
  })
})
