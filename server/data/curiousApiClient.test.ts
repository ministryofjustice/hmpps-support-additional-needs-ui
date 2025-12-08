import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import CuriousApiClient from './curiousApiClient'
import { anAllAssessmentDTO } from '../testsupport/curiousAssessmentsTestDataBuilder'

describe('curiousApiClient', () => {
  const username = 'A-DPS-USER'
  const systemToken = 'test-system-token'
  const prisonNumber = 'A1234BC'

  const mockAuthenticationClient = {
    getToken: jest.fn(),
  } as unknown as jest.Mocked<AuthenticationClient>
  const curiousApiClient = new CuriousApiClient(mockAuthenticationClient)

  config.apis.curious.url = 'http://localhost:8200'
  const curiousApi = nock(config.apis.curious.url)

  beforeEach(() => {
    jest.resetAllMocks()
    mockAuthenticationClient.getToken.mockResolvedValue(systemToken)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('getAssessmentsByPrisonNumber', () => {
    it('should get assessments for a prisoner', async () => {
      // Given
      const expectedResponse = anAllAssessmentDTO()
      curiousApi
        .get(`/learnerAssessments/v2/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await curiousApiClient.getAssessmentsByPrisonNumber(prisonNumber, username)

      // Then
      expect(actual).toEqual(expectedResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should return null given API returns a not found error', async () => {
      // Given
      const apiErrorResponse = {
        status: 404,
        userMessage: 'Not found',
        developerMessage: 'Not found',
      }

      curiousApi
        .get(`/learnerAssessments/v2/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await curiousApiClient.getAssessmentsByPrisonNumber(prisonNumber, username)

      // Then
      expect(actual).toBeNull()
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      curiousApi
        .get(`/learnerAssessments/v2/${prisonNumber}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await curiousApiClient.getAssessmentsByPrisonNumber(prisonNumber, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })
})
