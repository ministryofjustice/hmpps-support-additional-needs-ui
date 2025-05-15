import type { UserCaseloadDetail } from 'manageUsersApiClient'
import UserCaseloadDetailStore from './userCaseloadDetailStore'
import { RedisClient } from '../redisClient'

const redisClient = {
  on: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  connect: jest.fn(),
}

describe('userCaseloadDetailStore', () => {
  const userCaseloadDetailStore = new UserCaseloadDetailStore(redisClient as unknown as RedisClient)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should set user caseload detail', async () => {
    // Given
    const userCaseloadDetail: UserCaseloadDetail = {
      username: 'user1',
      active: true,
      accountType: 'GENERAL',
      activeCaseload: { id: 'BXI', name: 'BRIXTON (HMP)' },
      caseloads: [
        { id: 'BXI', name: 'BRIXTON (HMP)' },
        { id: 'LEI', name: 'LEEDS (HMP)' },
      ],
    }

    redisClient.set.mockResolvedValue(null)
    const durationHours = 2

    // When
    await userCaseloadDetailStore.setUserCaseloadDetail(userCaseloadDetail, durationHours)

    // Then
    expect(redisClient.set).toHaveBeenCalledWith(
      'userCaseloadDetail.user1',
      JSON.stringify(userCaseloadDetail),
      { EX: 7200 }, // 2 hours in seconds
    )
  })

  it('should get user caseload detail given users caseload detail is in redis', async () => {
    // Given
    const userCaseloadDetail: UserCaseloadDetail = {
      username: 'user1',
      active: true,
      accountType: 'GENERAL',
      activeCaseload: { id: 'BXI', name: 'BRIXTON (HMP)' },
      caseloads: [
        { id: 'BXI', name: 'BRIXTON (HMP)' },
        { id: 'LEI', name: 'LEEDS (HMP)' },
      ],
    }
    const serializedUserCaseloadDetail = JSON.stringify(userCaseloadDetail)
    redisClient.get.mockResolvedValue(serializedUserCaseloadDetail)

    // When
    const returnedUserCaseloadDetail = await userCaseloadDetailStore.getUserCaseloadDetail('user1')

    // Then
    expect(returnedUserCaseloadDetail).toStrictEqual(userCaseloadDetail)
    expect(redisClient.get).toHaveBeenCalledWith('userCaseloadDetail.user1')
  })

  it('should get null user case load detail given the users caseload detail is not in redis', async () => {
    // Given
    const serializedUserCaseloadDetail: string = null
    redisClient.get.mockResolvedValue(serializedUserCaseloadDetail)

    // When
    const returnedUserCaseloadDetail = await userCaseloadDetailStore.getUserCaseloadDetail('user2')

    // Then
    expect(returnedUserCaseloadDetail).toBeNull()
    expect(redisClient.get).toHaveBeenCalledWith('userCaseloadDetail.user2')
  })

  it('should not get user case load detail given redis client throws an error', async () => {
    // Given
    redisClient.get.mockRejectedValue('some error')

    // When
    try {
      await userCaseloadDetailStore.getUserCaseloadDetail('user1')
    } catch (error) {
      // Then
      expect(error).toBe('some error')
      expect(redisClient.get).toHaveBeenCalledWith('userCaseloadDetail.user1')
    }
  })
})
