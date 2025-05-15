import type { UserCaseloadDetail } from 'manageUsersApiClient'
import UserService from './userService'
import ManageUsersApiClient from '../data/manageUsersApiClient'
import UserCaseloadDetailStore from '../data/userCaseloadDetailStore/userCaseloadDetailStore'

jest.mock('../data/manageUsersApiClient')
jest.mock('../data/userCaseloadDetailStore/userCaseloadDetailStore')

describe('userService', () => {
  const manageUsersApiClient = new ManageUsersApiClient(null) as jest.Mocked<ManageUsersApiClient>
  const userCaseloadDetailStore = new UserCaseloadDetailStore(null) as jest.Mocked<UserCaseloadDetailStore>
  const userService = new UserService(manageUsersApiClient, userCaseloadDetailStore)

  const username = 'some-username'
  const userToken = 'a-user-token'

  const userCaseloadDetail: UserCaseloadDetail = {
    username,
    active: true,
    accountType: 'GENERAL',
    activeCaseload: { id: 'BXI', name: 'BRIXTON (HMP)' },
    caseloads: [
      { id: 'BXI', name: 'BRIXTON (HMP)' },
      { id: 'LEI', name: 'LEEDS (HMP)' },
    ],
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getUserCaseLoads', () => {
    it('should get user caseload detail given it has been previously cached', async () => {
      // Given
      userCaseloadDetailStore.getUserCaseloadDetail.mockResolvedValue(userCaseloadDetail)

      // When
      const actual = await userService.getUserCaseLoads(username, userToken)

      // Then
      expect(actual).toEqual(userCaseloadDetail)
      expect(userCaseloadDetailStore.getUserCaseloadDetail).toHaveBeenCalledWith(username)
      expect(manageUsersApiClient.getUserCaseLoads).not.toHaveBeenCalled()
      expect(userCaseloadDetailStore.setUserCaseloadDetail).not.toHaveBeenCalled()
    })

    it('should get user caseload detail given it has not been previously cached', async () => {
      // Given
      userCaseloadDetailStore.getUserCaseloadDetail.mockResolvedValue(null)
      manageUsersApiClient.getUserCaseLoads.mockResolvedValue(userCaseloadDetail)

      // When
      const actual = await userService.getUserCaseLoads(username, userToken)

      // Then
      expect(actual).toEqual(userCaseloadDetail)
      expect(userCaseloadDetailStore.getUserCaseloadDetail).toHaveBeenCalledWith(username)
      expect(manageUsersApiClient.getUserCaseLoads).toHaveBeenCalledWith(userToken)
      expect(userCaseloadDetailStore.setUserCaseloadDetail).toHaveBeenCalledWith(userCaseloadDetail, 1)
    })

    it('should get user caseload detail given retrieving from cache throws an error', async () => {
      // Given
      userCaseloadDetailStore.getUserCaseloadDetail.mockRejectedValue('some-error')
      manageUsersApiClient.getUserCaseLoads.mockResolvedValue(userCaseloadDetail)

      // When
      const actual = await userService.getUserCaseLoads(username, userToken)

      // Then
      expect(actual).toEqual(userCaseloadDetail)
      expect(userCaseloadDetailStore.getUserCaseloadDetail).toHaveBeenCalledWith(username)
      expect(manageUsersApiClient.getUserCaseLoads).toHaveBeenCalledWith(userToken)
      expect(userCaseloadDetailStore.setUserCaseloadDetail).toHaveBeenCalledWith(userCaseloadDetail, 1)
    })

    it('should not get user caseload detail given retrieving from cache and API both throw errors', async () => {
      // Given
      userCaseloadDetailStore.getUserCaseloadDetail.mockRejectedValue('some-cache-error')
      manageUsersApiClient.getUserCaseLoads.mockRejectedValue('some-api-error')

      // When
      const actual = await userService.getUserCaseLoads(username, userToken)

      // Then
      expect(actual).toBeUndefined()
      expect(userCaseloadDetailStore.getUserCaseloadDetail).toHaveBeenCalledWith(username)
      expect(manageUsersApiClient.getUserCaseLoads).toHaveBeenCalledWith(userToken)
      expect(userCaseloadDetailStore.setUserCaseloadDetail).not.toHaveBeenCalled()
    })

    it('should get user caseload detail given it has not been previously cached but putting in cache throws an error', async () => {
      // Given
      userCaseloadDetailStore.getUserCaseloadDetail.mockResolvedValue(null)
      manageUsersApiClient.getUserCaseLoads.mockResolvedValue(userCaseloadDetail)
      userCaseloadDetailStore.setUserCaseloadDetail.mockRejectedValue('some-error')

      // When
      const actual = await userService.getUserCaseLoads(username, userToken)

      // Then
      expect(actual).toEqual(userCaseloadDetail)
      expect(userCaseloadDetailStore.getUserCaseloadDetail).toHaveBeenCalledWith(username)
      expect(manageUsersApiClient.getUserCaseLoads).toHaveBeenCalledWith(userToken)
      expect(userCaseloadDetailStore.setUserCaseloadDetail).toHaveBeenCalledWith(userCaseloadDetail, 1)
    })
  })
})
