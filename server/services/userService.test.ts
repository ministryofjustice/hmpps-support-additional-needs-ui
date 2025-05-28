import type { UserCaseloadDetail } from 'manageUsersApiClient'
import UserService from './userService'
import ManageUsersApiClient from '../data/manageUsersApiClient'

jest.mock('../data/manageUsersApiClient')

describe('userService', () => {
  const manageUsersApiClient = new ManageUsersApiClient(null) as jest.Mocked<ManageUsersApiClient>
  const userService = new UserService(manageUsersApiClient)

  const userToken = 'a-user-token'

  const userCaseloadDetail: UserCaseloadDetail = {
    username: 'some-username',
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
    it('should get user caseload detail', async () => {
      // Given
      manageUsersApiClient.getUserCaseLoads.mockResolvedValue(userCaseloadDetail)

      // When
      const actual = await userService.getUserCaseLoads(userToken)

      // Then
      expect(actual).toEqual(userCaseloadDetail)
      expect(manageUsersApiClient.getUserCaseLoads).toHaveBeenCalledWith(userToken)
    })

    it('should not get user caseload detail given retrieving from API throws error', async () => {
      // Given
      manageUsersApiClient.getUserCaseLoads.mockRejectedValue('some-api-error')

      // When
      const actual = await userService.getUserCaseLoads(userToken)

      // Then
      expect(actual).toBeUndefined()
      expect(manageUsersApiClient.getUserCaseLoads).toHaveBeenCalledWith(userToken)
    })
  })
})
