import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import nock from 'nock'
import SupportAdditionalNeedsApiClient from './supportAdditionalNeedsApiClient'
import aValidSearchByPrisonResponse from '../testsupport/searchByPrisonResponseTestDataBuiilder'
import aValidPerson from '../testsupport/personTestDataBuilder'
import config from '../config'
import SearchSortField from '../enums/searchSortField'
import SearchSortDirection from '../enums/searchSortDirection'

describe('supportAdditionalNeedsApiClient', () => {
  const username = 'A-DPS-USER'
  const systemToken = 'test-system-token'

  const mockAuthenticationClient = {
    getToken: jest.fn(),
  } as unknown as jest.Mocked<AuthenticationClient>
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(mockAuthenticationClient)

  config.apis.prisonerSearch.url = 'http://localhost:8200'
  const supportAdditionalNeedsApi = nock(config.apis.supportAdditionalNeedsApi.url)

  beforeEach(() => {
    jest.resetAllMocks()
    mockAuthenticationClient.getToken.mockResolvedValue(systemToken)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getPrisonersByPrisonId', () => {
    it('should get prisoners by prison id given prison ID exists', async () => {
      // Given
      const prisonId = 'BXI'

      const searchByPrisonResponse = aValidSearchByPrisonResponse({
        totalElements: 2,
        people: [
          aValidPerson({ forename: 'YMYNNEUMAR', surname: 'SARERLY' }),
          aValidPerson({ forename: 'DINEENG', surname: 'BRIANORES' }),
        ],
      })
      supportAdditionalNeedsApi
        .get(`/search/prisons/${prisonId}/people`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, searchByPrisonResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getPrisonersByPrisonId(prisonId, username)

      // Then
      expect(actual).toEqual(searchByPrisonResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should get zero prisoners by prison id given prison ID does not exist', async () => {
      // Given
      const prisonId = 'some-unknown-prison-id'

      const searchByPrisonResponse = aValidSearchByPrisonResponse({
        totalElements: 0,
        people: [],
      })
      supportAdditionalNeedsApi
        .get(`/search/prisons/${prisonId}/people`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, searchByPrisonResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getPrisonersByPrisonId(prisonId, username)

      // Then
      expect(actual).toEqual(searchByPrisonResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should get prisoners by prison id given filtering, pagination and sorting options are specified', async () => {
      // Given
      const prisonId = 'BXI'
      const prisonerNameOrNumber = 'YMYNNEUMAR'
      const page = 2
      const pageSize = 20
      const sortBy = SearchSortField.CELL_LOCATION
      const sortDirection = SearchSortDirection.DESC

      const searchByPrisonResponse = aValidSearchByPrisonResponse({
        totalElements: 2,
        people: [
          aValidPerson({ forename: 'YMYNNEUMAR', surname: 'SARERLY' }),
          aValidPerson({ forename: 'YMYNNEUMAR', surname: 'BRIANORES' }),
        ],
      })
      supportAdditionalNeedsApi
        .get(
          `/search/prisons/${prisonId}/people?prisonerNameOrNumber=${prisonerNameOrNumber}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, searchByPrisonResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getPrisonersByPrisonId(
        prisonId,
        username,
        prisonerNameOrNumber,
        page,
        pageSize,
        sortBy,
        sortDirection,
      )

      // Then
      expect(actual).toEqual(searchByPrisonResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const prisonId = 'some-unknown-prison-id'

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      supportAdditionalNeedsApi
        .get(`/search/prisons/${prisonId}/people`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient.getPrisonersByPrisonId(prisonId, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns a not found error', async () => {
      // Given
      const prisonId = 'some-unknown-prison-id'

      const apiErrorResponse = {
        status: 404,
        userMessage: 'Not found',
        developerMessage: 'Not found',
      }
      supportAdditionalNeedsApi
        .get(`/search/prisons/${prisonId}/people`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      const expectedError = new Error('Not Found')

      // When
      const actual = await supportAdditionalNeedsApiClient.getPrisonersByPrisonId(prisonId, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })
})
