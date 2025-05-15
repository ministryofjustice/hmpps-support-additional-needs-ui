import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import PrisonerSearchClient from './prisonerSearchClient'
import config from '../config'
import aValidPagedCollectionOfPrisoners from '../testsupport/pagedCollectionOfPrisonersTestDataBuilder'
import aValidPrisoner from '../testsupport/prisonerTestDataBuilder'

describe('prisonerSearchClient', () => {
  const username = 'A-DPS-USER'
  const systemToken = 'test-system-token'

  const mockAuthenticationClient = {
    getToken: jest.fn(),
  } as unknown as jest.Mocked<AuthenticationClient>
  const prisonerSearchClient = new PrisonerSearchClient(mockAuthenticationClient)

  config.apis.prisonerSearch.url = 'http://localhost:8200'
  const prisonerSearchApi = nock(config.apis.prisonerSearch.url)

  beforeEach(() => {
    jest.resetAllMocks()
    mockAuthenticationClient.getToken.mockResolvedValue(systemToken)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getPrisonerByPrisonNumber', () => {
    it('should get prisoner by prison number given prisoner exists', async () => {
      // Given
      const prisonNumber = 'A1234BC'

      const prisoner = aValidPrisoner()
      prisonerSearchApi
        .get(`/prisoner/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, prisoner)

      // When
      const actual = await prisonerSearchClient.getPrisonerByPrisonNumber(prisonNumber, username)

      // Then
      expect(actual).toEqual(prisoner)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should not get prisoner by prison number given prisoner does not exist', async () => {
      // Given
      const prisonNumber = 'A1234BC'

      prisonerSearchApi
        .get(`/prisoner/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404)

      // When
      const actual = await prisonerSearchClient.getPrisonerByPrisonNumber(prisonNumber, username)

      // Then
      expect(actual).toBeNull()
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getPrisonersByPrisonId', () => {
    it('should get prisoners by prison id given prison ID exists', async () => {
      // Given
      const prisonId = 'BXI'

      const page = 0
      const pageSize = 100

      const pagedCollectionOfPrisoners = aValidPagedCollectionOfPrisoners({
        number: 2,
        content: [
          aValidPrisoner({ firstName: 'Fred', lastName: 'Blogs' }),
          aValidPrisoner({ firstName: 'Martin', lastName: 'McDougal' }),
        ],
      })
      prisonerSearchApi
        .get(
          `/prisoner-search/prison/${prisonId}?page=${page}&size=${pageSize}&responseFields=prisonerNumber&responseFields=prisonId&responseFields=releaseDate&responseFields=firstName&responseFields=lastName&responseFields=receptionDate&responseFields=dateOfBirth&responseFields=cellLocation&responseFields=restrictedPatient&responseFields=supportingPrisonId`,
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, pagedCollectionOfPrisoners)

      // When
      const actual = await prisonerSearchClient.getPrisonersByPrisonId(prisonId, page, pageSize, username)

      // Then
      expect(actual).toEqual(pagedCollectionOfPrisoners)
      expect(nock.isDone()).toBe(true)
    })

    it('should get zero prisoners by prison id given prison ID does not exist', async () => {
      // Given
      const prisonId = 'some-unknown-prison-id'

      const page = 0
      const pageSize = 100

      const pagedCollectionOfPrisoners = aValidPagedCollectionOfPrisoners({
        number: 0,
        content: [],
      })
      prisonerSearchApi
        .get(
          `/prisoner-search/prison/${prisonId}?page=${page}&size=${pageSize}&responseFields=prisonerNumber&responseFields=prisonId&responseFields=releaseDate&responseFields=firstName&responseFields=lastName&responseFields=receptionDate&responseFields=dateOfBirth&responseFields=cellLocation&responseFields=restrictedPatient&responseFields=supportingPrisonId`,
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, pagedCollectionOfPrisoners)

      // When
      const actual = await prisonerSearchClient.getPrisonersByPrisonId(prisonId, page, pageSize, username)

      // Then
      expect(actual).toEqual(pagedCollectionOfPrisoners)
      expect(nock.isDone()).toBe(true)
    })

    it('should get zero prisoners by prison id given API returns a 404', async () => {
      // Given
      const prisonId = 'some-unknown-prison-id'

      const page = 0
      const pageSize = 100

      const apiErrorResponse = {
        status: 404,
        userMessage: 'Not found',
        developerMessage: 'Not found',
      }
      prisonerSearchApi
        .get(
          `/prisoner-search/prison/${prisonId}?page=${page}&size=${pageSize}&responseFields=prisonerNumber&responseFields=prisonId&responseFields=releaseDate&responseFields=firstName&responseFields=lastName&responseFields=receptionDate&responseFields=dateOfBirth&responseFields=cellLocation&responseFields=restrictedPatient&responseFields=supportingPrisonId`,
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await prisonerSearchClient.getPrisonersByPrisonId(prisonId, page, pageSize, username)

      // Then
      expect(actual).toBeNull()
      expect(nock.isDone()).toBe(true)
    })
  })
})
