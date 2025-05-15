import nock from 'nock'

import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { UserCaseloadDetail } from 'manageUsersApiClient'
import ManageUsersApiClient from './manageUsersApiClient'
import config from '../config'

describe('manageUsersApiClient', () => {
  const mockAuthenticationClient = {} as unknown as jest.Mocked<AuthenticationClient>
  const manageUsersApiClient = new ManageUsersApiClient(mockAuthenticationClient)

  const fakeManageUsersApiClient = nock(config.apis.manageUsersApi.url)

  const userToken = { access_token: 'test-user-token', expires_in: 300 }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getUserCaseLoads', () => {
    it('should get user case load details', async () => {
      // Given
      const expectedUserCaseloadDetail: UserCaseloadDetail = {
        username: 'user1',
        active: true,
        accountType: 'GENERAL',
        activeCaseload: { id: 'BXI', name: 'BRIXTON (HMP)' },
        caseloads: [
          { id: 'BXI', name: 'BRIXTON (HMP)' },
          { id: 'LEI', name: 'LEEDS (HMP)' },
        ],
      }
      fakeManageUsersApiClient
        .get('/users/me/caseloads')
        .matchHeader('authorization', `Bearer ${userToken.access_token}`)
        .reply(200, expectedUserCaseloadDetail)

      // When
      const actual = await manageUsersApiClient.getUserCaseLoads(userToken.access_token)

      // Then
      expect(nock.isDone()).toBe(true)
      expect(actual).toEqual(expectedUserCaseloadDetail)
    })

    it('should not get user case load details given API returns an error response', async () => {
      // Given
      const expectedResponseBody = {
        status: 500,
        userMessage: 'An unexpected error occurred',
        developerMessage: 'An unexpected error occurred',
      }
      fakeManageUsersApiClient
        .get('/users/me/caseloads')
        .matchHeader('authorization', `Bearer ${userToken.access_token}`)
        .thrice()
        .reply(500, expectedResponseBody)

      // When
      try {
        await manageUsersApiClient.getUserCaseLoads(userToken.access_token)
      } catch (e) {
        // Then
        expect(nock.isDone()).toBe(true)
        expect(e.responseStatus).toEqual(500)
        expect(e.data).toEqual(expectedResponseBody)
      }
    })
  })
})
