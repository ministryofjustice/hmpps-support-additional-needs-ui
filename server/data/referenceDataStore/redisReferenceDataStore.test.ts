import RedisReferenceDataStore from './redisReferenceDataStore'
import ReferenceDataStore from './referenceDataStore'
import { RedisClient } from '../redisClient'
import ReferenceDataDomain from '../../enums/referenceDataDomain'
import { aValidReferenceDataListResponse } from '../../testsupport/referenceDataResponseTestDataBuilder'

describe('redisReferenceDataStore', () => {
  const redisClient = {
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    connect: jest.fn(),
  }

  const referenceDataStore: ReferenceDataStore = new RedisReferenceDataStore(redisClient as unknown as RedisClient)

  const referenceData = aValidReferenceDataListResponse()

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('reference data', () => {
    it('should set reference data', async () => {
      // Given
      const durationHours = 2

      // When
      await referenceDataStore.setReferenceData(
        ReferenceDataDomain.CHALLENGE,
        false,
        false,
        referenceData,
        durationHours,
      )

      // Then
      expect(redisClient.set).toHaveBeenCalledWith(
        'CHALLENGE.excludesInactive',
        JSON.stringify(referenceData),
        { EX: 7200 }, // 2 hours in seconds
      )
    })

    it('should get reference data given redis client returns reference data', async () => {
      // Given
      const serializedReferenceData = JSON.stringify(referenceData)
      redisClient.get.mockResolvedValue(serializedReferenceData)

      // When
      const returnedReferenceData = await referenceDataStore.getReferenceData(
        ReferenceDataDomain.CHALLENGE,
        false,
        true,
      )

      // Then
      expect(returnedReferenceData).toEqual(referenceData)
      expect(redisClient.get).toHaveBeenCalledWith('CHALLENGE.includesInactive')
    })

    it('should get undefined given reference data not in redis', async () => {
      // Given
      const serializedReferenceData: string = null
      redisClient.get.mockResolvedValue(serializedReferenceData)

      // When
      const returnedReferenceData = await referenceDataStore.getReferenceData(
        ReferenceDataDomain.STRENGTH,
        false,
        false,
      )

      // Then
      expect(returnedReferenceData).toBeUndefined()
      expect(redisClient.get).toHaveBeenCalledWith('STRENGTH.excludesInactive')
    })

    it('should not get reference data given redis client throws an error', async () => {
      // Given
      redisClient.get.mockRejectedValue('some error')

      // When
      try {
        await referenceDataStore.getReferenceData(ReferenceDataDomain.CONDITION, true, false)
      } catch (error) {
        // Then
        expect(error).toBe('some error')
        expect(redisClient.get).toHaveBeenCalledWith('CONDITION.categories.excludesInactive')
      }
    })
  })
})
