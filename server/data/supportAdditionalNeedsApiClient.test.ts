import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import nock from 'nock'
import { isEqual, isMatch } from 'lodash'
import SupportAdditionalNeedsApiClient from './supportAdditionalNeedsApiClient'
import aValidSearchByPrisonResponse from '../testsupport/searchByPrisonResponseTestDataBuiilder'
import aValidPerson from '../testsupport/personTestDataBuilder'
import config from '../config'
import SearchSortField from '../enums/searchSortField'
import SearchSortDirection from '../enums/searchSortDirection'
import aValidCreateEducationSupportPlanRequest from '../testsupport/createEducationSupportPlanRequestTestDataBuilder'
import aValidEducationSupportPlanResponse from '../testsupport/educationSupportPlanResponseTestDataBuilder'
import { aValidPlanCreationSchedulesResponse } from '../testsupport/planCreationScheduleResponseTestDataBuilder'
import aValidUpdatePlanCreationStatusRequest from '../testsupport/updatePlanCreationStatusRequestTestDataBuilder'
import { aValidCreateChallengesRequest } from '../testsupport/challengeRequestTestDataBuilder'
import { aValidChallengeListResponse, aValidChallengeResponse } from '../testsupport/challengeResponseTestDataBuilder'
import { aValidCreateConditionsRequest } from '../testsupport/conditionRequestTestDataBuilder'
import { aValidConditionListResponse } from '../testsupport/conditionResponseTestDataBuilder'
import { aValidReferenceDataListResponse } from '../testsupport/referenceDataResponseTestDataBuilder'
import { aValidStrengthListResponse, aValidStrengthResponse } from '../testsupport/strengthResponseTestDataBuilder'
import { aValidCreateStrengthsRequest } from '../testsupport/strengthRequestTestDataBuilder'
import ReferenceDataDomain from '../enums/referenceDataDomain'
import { aValidAlnScreenerRequest } from '../testsupport/alnScreenerRequestTestDataBuilder'
import { aValidAlnScreeners } from '../testsupport/alnScreenerResponseTestDataBuilder'
import {
  aValidSupportStrategyListResponse,
  aValidSupportStrategyResponse,
} from '../testsupport/supportStrategyResponseTestDataBuilder'
import { aValidCreateSupportStrategiesRequest } from '../testsupport/supportStrategyRequestTestDataBuilder'
import aPlanActionStatus from '../testsupport/planActionStatusTestDataBuilder'
import { aSupportPlanReviewRequest } from '../testsupport/supportPlanReviewRequestTestDataBuilder'
import { aPlanReviewsResponse } from '../testsupport/planReviewsResponseTestDataBuilder'
import anUpdateChallengeRequest from '../testsupport/updateChallengeRequestTestDataBuilder'
import anUpdateStrengthRequest from '../testsupport/updateStrengthRequestTestDataBuilder'
import anUpdateSupportStrategyRequest from '../testsupport/updateSupportStrategyRequestTestDataBuilder'

describe('supportAdditionalNeedsApiClient', () => {
  const username = 'A-DPS-USER'
  const systemToken = 'test-system-token'
  const prisonNumber = 'A1234BC'
  const prisonId = 'BXI'
  const challengeReference = '748f6f21-d900-40ca-a5bd-f887503481de'
  const strengthReference = '219ad763-b349-4007-aaf4-cba7f5c0417c'
  const supportStrategyReference = 'ab1fc09c-fac6-47fd-97be-6ba2a94fbc9e'

  const mockAuthenticationClient = {
    getToken: jest.fn(),
  } as unknown as jest.Mocked<AuthenticationClient>
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(mockAuthenticationClient)

  config.apis.supportAdditionalNeedsApi.url = 'http://localhost:8200'
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
      const unknownPrisonId = 'some-unknown-prison-id'

      const searchByPrisonResponse = aValidSearchByPrisonResponse({
        totalElements: 0,
        people: [],
      })
      supportAdditionalNeedsApi
        .get(`/search/prisons/${unknownPrisonId}/people`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, searchByPrisonResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getPrisonersByPrisonId(unknownPrisonId, username)

      // Then
      expect(actual).toEqual(searchByPrisonResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should get prisoners by prison id given filtering, pagination and sorting options are specified', async () => {
      // Given
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

  describe('getEducationSupportPlan', () => {
    it('should get a prisoners Education Support Plan', async () => {
      // Given
      const expectedResponse = aValidEducationSupportPlanResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/education-support-plan`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getEducationSupportPlan(prisonNumber, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/education-support-plan`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getEducationSupportPlan(prisonNumber, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/education-support-plan`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient.getEducationSupportPlan(prisonNumber, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('createEducationSupportPlan', () => {
    it('should create a prisoners education support plan', async () => {
      // Given
      const createEducationSupportPlanRequest = aValidCreateEducationSupportPlanRequest()

      const expectedResponse = aValidEducationSupportPlanResponse()
      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/education-support-plan`, requestBody =>
          isEqual(requestBody, createEducationSupportPlanRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(201, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.createEducationSupportPlan(
        prisonNumber,
        username,
        createEducationSupportPlanRequest,
      )

      // Then
      expect(actual).toEqual(expectedResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const createEducationSupportPlanRequest = aValidCreateEducationSupportPlanRequest()

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/education-support-plan`, requestBody =>
          isEqual(requestBody, createEducationSupportPlanRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .createEducationSupportPlan(prisonNumber, username, createEducationSupportPlanRequest)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getEducationSupportPlanCreationSchedules', () => {
    it('should get a prisoners full history of education support plan creation schedules', async () => {
      // Given
      const planCreationSchedulesResponse = aValidPlanCreationSchedulesResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/plan-creation-schedule`)
        .query(queryParams => queryParams.includeAllHistory === 'true')
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, planCreationSchedulesResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getEducationSupportPlanCreationSchedules(
        prisonNumber,
        username,
      )

      // Then
      expect(actual).toEqual(planCreationSchedulesResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should get a prisoners latest education support plan creation schedule', async () => {
      // Given
      const planCreationSchedulesResponse = aValidPlanCreationSchedulesResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/plan-creation-schedule`)
        .query(queryParams => queryParams.includeAllHistory === 'false')
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, planCreationSchedulesResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getEducationSupportPlanCreationSchedules(
        prisonNumber,
        username,
        false,
      )

      // Then
      expect(actual).toEqual(planCreationSchedulesResponse)
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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/plan-creation-schedule`)
        .query(queryParams => queryParams.includeAllHistory === 'true')
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getEducationSupportPlanCreationSchedules(
        prisonNumber,
        username,
      )

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/plan-creation-schedule`)
        .query(queryParams => queryParams.includeAllHistory === 'true')
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .getEducationSupportPlanCreationSchedules(prisonNumber, username)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('updateEducationSupportPlanCreationScheduleStatus', () => {
    it('should update a prisoners education support plan creation schedule status', async () => {
      // Given
      const updatePlanCreationStatusRequest = aValidUpdatePlanCreationStatusRequest()

      const expectedResponse = aValidEducationSupportPlanResponse()
      supportAdditionalNeedsApi
        .patch(`/profile/${prisonNumber}/plan-creation-schedule/status`, requestBody =>
          isMatch(requestBody, updatePlanCreationStatusRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.updateEducationSupportPlanCreationScheduleStatus(
        prisonNumber,
        username,
        updatePlanCreationStatusRequest,
      )

      // Then
      expect(actual).toEqual(expectedResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const updatePlanCreationStatusRequest = aValidUpdatePlanCreationStatusRequest()

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      supportAdditionalNeedsApi
        .patch(`/profile/${prisonNumber}/plan-creation-schedule/status`, requestBody =>
          isMatch(requestBody, updatePlanCreationStatusRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .updateEducationSupportPlanCreationScheduleStatus(prisonNumber, username, updatePlanCreationStatusRequest)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('createChallenges', () => {
    it('should create challenges for a prisoner', async () => {
      // Given
      const createChallengesRequest = aValidCreateChallengesRequest()

      const expectedResponse = aValidChallengeListResponse()
      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/challenges`, requestBody => isMatch(requestBody, createChallengesRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.createChallenges(
        prisonNumber,
        username,
        createChallengesRequest,
      )

      // Then
      expect(actual).toEqual(expectedResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const createChallengesRequest = aValidCreateChallengesRequest()

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/challenges`, requestBody => isMatch(requestBody, createChallengesRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .createChallenges(prisonNumber, username, createChallengesRequest)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('createConditions', () => {
    it('should create conditions for a prisoner', async () => {
      // Given
      const createConditionsRequest = aValidCreateConditionsRequest()

      const expectedResponse = aValidConditionListResponse()
      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/conditions`, requestBody => isMatch(requestBody, createConditionsRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.createConditions(
        prisonNumber,
        username,
        createConditionsRequest,
      )

      // Then
      expect(actual).toEqual(expectedResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const createConditionsRequest = aValidCreateConditionsRequest()

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/conditions`, requestBody => isMatch(requestBody, createConditionsRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .createConditions(prisonNumber, username, createConditionsRequest)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getConditions', () => {
    it('should get conditions for a prisoner', async () => {
      // Given
      const expectedResponse = aValidConditionListResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/conditions`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getConditions(prisonNumber, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/conditions`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getConditions(prisonNumber, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/conditions`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient.getConditions(prisonNumber, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getReferenceData', () => {
    it('should get reference data given categories and inactive flags are not set', async () => {
      // Given
      const domain = ReferenceDataDomain.CHALLENGE

      const referenceDataListResponse = aValidReferenceDataListResponse()

      supportAdditionalNeedsApi
        .get(`/reference-data/${domain}`)
        .query(queryParams => queryParams.includeInactive === 'false')
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, referenceDataListResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getReferenceData(username, domain)

      // Then
      expect(actual).toEqual(referenceDataListResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should get reference data given categories flag is set', async () => {
      // Given
      const domain = ReferenceDataDomain.CHALLENGE

      const referenceDataListResponse = aValidReferenceDataListResponse()

      supportAdditionalNeedsApi
        .get(`/reference-data/${domain}/categories`)
        .query(queryParams => queryParams.includeInactive === 'false')
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, referenceDataListResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getReferenceData(username, domain, {
        categoriesOnly: true,
        includeInactive: false,
      })

      // Then
      expect(actual).toEqual(referenceDataListResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should get reference data given inactive flag is set', async () => {
      // Given
      const domain = ReferenceDataDomain.CHALLENGE

      const referenceDataListResponse = aValidReferenceDataListResponse()

      supportAdditionalNeedsApi
        .get(`/reference-data/${domain}`)
        .query(queryParams => queryParams.includeInactive === 'true')
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, referenceDataListResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getReferenceData(username, domain, {
        categoriesOnly: false,
        includeInactive: true,
      })

      // Then
      expect(actual).toEqual(referenceDataListResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const domain = ReferenceDataDomain.CHALLENGE

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      supportAdditionalNeedsApi
        .get(`/reference-data/${domain}`)
        .query(queryParams => queryParams.includeInactive === 'false')
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient.getReferenceData(username, domain).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('createStrengths', () => {
    it('should create strengths for a prisoner', async () => {
      // Given
      const createStrengthsRequest = aValidCreateStrengthsRequest()

      const expectedResponse = aValidStrengthListResponse()
      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/strengths`, requestBody => isMatch(requestBody, createStrengthsRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.createStrengths(
        prisonNumber,
        username,
        createStrengthsRequest,
      )

      // Then
      expect(actual).toEqual(expectedResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const createStrengthsRequest = aValidCreateStrengthsRequest()

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/strengths`, requestBody => isMatch(requestBody, createStrengthsRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .createStrengths(prisonNumber, username, createStrengthsRequest)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getStrengths', () => {
    it('should get strengths for a prisoner', async () => {
      // Given
      const expectedResponse = aValidStrengthListResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/strengths`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getStrengths(prisonNumber, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/strengths`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getStrengths(prisonNumber, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/strengths`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient.getStrengths(prisonNumber, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getStrength', () => {
    it('should get strength for a prisoner', async () => {
      // Given
      const expectedResponse = aValidStrengthResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/strengths/${strengthReference}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getStrength(prisonNumber, strengthReference, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/strengths/${strengthReference}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getStrength(prisonNumber, strengthReference, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/strengths/${strengthReference}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .getStrength(prisonNumber, strengthReference, username)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('updateStrength', () => {
    it('should update a prisoners strength', async () => {
      // Given
      const updateStrengthRequest = anUpdateStrengthRequest()

      supportAdditionalNeedsApi
        .put(`/profile/${prisonNumber}/strengths/${strengthReference}`, requestBody =>
          isEqual(requestBody, updateStrengthRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(204)

      // When
      const actual = await supportAdditionalNeedsApiClient.updateStrength(
        prisonNumber,
        strengthReference,
        username,
        updateStrengthRequest,
      )

      // Then
      expect(actual).toEqual({})
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const updateStrengthRequest = anUpdateStrengthRequest()

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      supportAdditionalNeedsApi
        .put(`/profile/${prisonNumber}/strengths/${strengthReference}`, requestBody =>
          isEqual(requestBody, updateStrengthRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .updateStrength(prisonNumber, strengthReference, username, updateStrengthRequest)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('createSupportStrategies', () => {
    it('should create support strategies for a prisoner', async () => {
      // Given
      const createSupportStrategiesRequest = aValidCreateSupportStrategiesRequest()

      const expectedResponse = aValidSupportStrategyListResponse()
      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/support-strategies`, requestBody =>
          isMatch(requestBody, createSupportStrategiesRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.createSupportStrategies(
        prisonNumber,
        username,
        createSupportStrategiesRequest,
      )

      // Then
      expect(actual).toEqual(expectedResponse)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const createSupportStrategiesRequest = aValidCreateSupportStrategiesRequest()

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/support-strategies`, requestBody =>
          isMatch(requestBody, createSupportStrategiesRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .createSupportStrategies(prisonNumber, username, createSupportStrategiesRequest)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getSupportStrategies', () => {
    it('should get support strategies for a prisoner', async () => {
      // Given
      const expectedResponse = aValidSupportStrategyListResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/support-strategies`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getSupportStrategies(prisonNumber, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/support-strategies`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getSupportStrategies(prisonNumber, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/support-strategies`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient.getSupportStrategies(prisonNumber, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getSupportStrategy', () => {
    it('should get support strategy for a prisoner', async () => {
      // Given
      const expectedResponse = aValidSupportStrategyResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/support-strategies/${supportStrategyReference}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getSupportStrategy(
        prisonNumber,
        supportStrategyReference,
        username,
      )

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/support-strategies/${supportStrategyReference}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getSupportStrategy(
        prisonNumber,
        supportStrategyReference,
        username,
      )

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/support-strategies/${supportStrategyReference}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .getSupportStrategy(prisonNumber, supportStrategyReference, username)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('updateSupportStrategy', () => {
    it('should update a prisoners strength', async () => {
      // Given
      const updateSupportStrategyRequest = anUpdateSupportStrategyRequest()

      supportAdditionalNeedsApi
        .put(`/profile/${prisonNumber}/support-strategies/${supportStrategyReference}`, requestBody =>
          isEqual(requestBody, updateSupportStrategyRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(204)

      // When
      const actual = await supportAdditionalNeedsApiClient.updateSupportStrategy(
        prisonNumber,
        supportStrategyReference,
        username,
        updateSupportStrategyRequest,
      )

      // Then
      expect(actual).toEqual({})
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const updateSupportStrategyRequest = anUpdateSupportStrategyRequest()

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      supportAdditionalNeedsApi
        .put(`/profile/${prisonNumber}/support-strategies/${supportStrategyReference}`, requestBody =>
          isEqual(requestBody, updateSupportStrategyRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .updateSupportStrategy(prisonNumber, supportStrategyReference, username, updateSupportStrategyRequest)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getChallenges', () => {
    it('should get challenges for a prisoner', async () => {
      // Given
      const expectedResponse = aValidChallengeListResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/challenges`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getChallenges(prisonNumber, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/challenges`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getChallenges(prisonNumber, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/challenges`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient.getChallenges(prisonNumber, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getChallenge', () => {
    it('should get challenge for a prisoner', async () => {
      // Given
      const expectedResponse = aValidChallengeResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/challenges/${challengeReference}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getChallenge(prisonNumber, challengeReference, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/challenges/${challengeReference}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getChallenge(prisonNumber, challengeReference, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/challenges/${challengeReference}`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .getChallenge(prisonNumber, challengeReference, username)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('updateChallenge', () => {
    it('should update a prisoners challenge', async () => {
      // Given
      const updateChallengeRequest = anUpdateChallengeRequest()

      supportAdditionalNeedsApi
        .put(`/profile/${prisonNumber}/challenges/${challengeReference}`, requestBody =>
          isEqual(requestBody, updateChallengeRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(204)

      // When
      const actual = await supportAdditionalNeedsApiClient.updateChallenge(
        prisonNumber,
        challengeReference,
        username,
        updateChallengeRequest,
      )

      // Then
      expect(actual).toEqual({})
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const updateChallengeRequest = anUpdateChallengeRequest()

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      supportAdditionalNeedsApi
        .put(`/profile/${prisonNumber}/challenges/${challengeReference}`, requestBody =>
          isEqual(requestBody, updateChallengeRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .updateChallenge(prisonNumber, challengeReference, username, updateChallengeRequest)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('createAdditionalLearningNeedsScreener', () => {
    it('should create ALN Screener for a prisoner', async () => {
      // Given
      const createAlnScreenerRequest = aValidAlnScreenerRequest()

      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/aln-screener`, requestBody => isMatch(requestBody, createAlnScreenerRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(201)

      // When
      const actual = await supportAdditionalNeedsApiClient.createAdditionalLearningNeedsScreener(
        prisonNumber,
        username,
        createAlnScreenerRequest,
      )

      // Then
      expect(actual).toEqual({})
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const createAlnScreenerRequest = aValidAlnScreenerRequest()

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/aln-screener`, requestBody => isMatch(requestBody, createAlnScreenerRequest))
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .createAdditionalLearningNeedsScreener(prisonNumber, username, createAlnScreenerRequest)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getAdditionalLearningNeedsScreeners', () => {
    it('should get a prisoners Additional Learning Needs screeners', async () => {
      // Given
      const expectedResponse = aValidAlnScreeners()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/aln-screener`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners(prisonNumber, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/aln-screener`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getAdditionalLearningNeedsScreeners(prisonNumber, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/aln-screener`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .getAdditionalLearningNeedsScreeners(prisonNumber, username)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getPlanActionStatus', () => {
    it('should get a prisoners plan action status', async () => {
      // Given
      const planActionStatusResponse = aPlanActionStatus()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/plan-action-status`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, planActionStatusResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getPlanActionStatus(prisonNumber, username)

      // Then
      expect(actual).toEqual(planActionStatusResponse)
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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/plan-action-status`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getPlanActionStatus(prisonNumber, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/plan-action-status`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient.getPlanActionStatus(prisonNumber, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('reviewEducationSupportPlan', () => {
    it('should review a prisoners education support plan', async () => {
      // Given
      const supportPlanReviewRequest = aSupportPlanReviewRequest()

      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/education-support-plan/review`, requestBody =>
          isEqual(requestBody, supportPlanReviewRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(201)

      // When
      const actual = await supportAdditionalNeedsApiClient.reviewEducationSupportPlan(
        prisonNumber,
        username,
        supportPlanReviewRequest,
      )

      // Then
      expect(actual).toEqual({})
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })

    it('should rethrow error given API returns an error', async () => {
      // Given
      const supportPlanReviewRequest = aSupportPlanReviewRequest()

      const apiErrorResponse = {
        status: 500,
        userMessage: 'Service unavailable',
        developerMessage: 'Service unavailable',
      }
      supportAdditionalNeedsApi
        .post(`/profile/${prisonNumber}/education-support-plan/review`, requestBody =>
          isEqual(requestBody, supportPlanReviewRequest),
        )
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .reviewEducationSupportPlan(prisonNumber, username, supportPlanReviewRequest)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })

  describe('getEducationSupportPlanReviews', () => {
    it('should get a prisoners Education Support Plan Reviews', async () => {
      // Given
      const expectedResponse = aPlanReviewsResponse()
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/education-support-plan/review`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(200, expectedResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getEducationSupportPlanReviews(prisonNumber, username)

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

      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/education-support-plan/review`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .reply(404, apiErrorResponse)

      // When
      const actual = await supportAdditionalNeedsApiClient.getEducationSupportPlanReviews(prisonNumber, username)

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
      supportAdditionalNeedsApi
        .get(`/profile/${prisonNumber}/education-support-plan/review`)
        .matchHeader('authorization', `Bearer ${systemToken}`)
        .thrice()
        .reply(500, apiErrorResponse)

      const expectedError = new Error('Internal Server Error')

      // When
      const actual = await supportAdditionalNeedsApiClient
        .getEducationSupportPlanReviews(prisonNumber, username)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledWith(username)
      expect(nock.isDone()).toBe(true)
    })
  })
})
