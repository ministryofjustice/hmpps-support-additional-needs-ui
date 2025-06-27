import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type {
  CreateEducationSupportPlanRequest,
  EducationSupportPlanResponse,
  PlanCreationSchedulesResponse,
  SearchByPrisonResponse,
} from 'supportAdditionalNeedsApiClient'
import config from '../config'
import logger from '../../logger'
import SearchSortField from '../enums/searchSortField'
import SearchSortDirection from '../enums/searchSortDirection'
import restClientErrorHandler from './restClientErrorHandler'

export default class SupportAdditionalNeedsApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Support Additional Needs API Client', config.apis.supportAdditionalNeedsApi, logger, authenticationClient)
  }

  async getPrisonersByPrisonId(
    prisonId: string,
    username: string,
    prisonerNameOrNumber?: string,
    page?: number,
    pageSize?: number,
    sortBy?: SearchSortField,
    sortDirection?: SearchSortDirection,
  ): Promise<SearchByPrisonResponse> {
    return this.get<SearchByPrisonResponse>(
      {
        path: `/search/prisons/${prisonId}/people`,
        query: {
          prisonerNameOrNumber,
          page,
          pageSize,
          sortBy,
          sortDirection,
        },
      },
      asSystem(username),
    )
  }

  async createEducationSupportPlan(
    prisonNumber: string,
    username: string,
    createEducationSupportPlanRequest: CreateEducationSupportPlanRequest,
  ): Promise<EducationSupportPlanResponse> {
    return this.post<EducationSupportPlanResponse>(
      {
        path: `/profile/${prisonNumber}/education-support-plan`,
        data: createEducationSupportPlanRequest,
      },
      asSystem(username),
    )
  }

  async getEducationSupportPlanCreationSchedules(
    prisonNumber: string,
    username: string,
  ): Promise<PlanCreationSchedulesResponse> {
    return this.get<PlanCreationSchedulesResponse>(
      {
        path: `/profile/${prisonNumber}/plan-creation-schedule`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }
}
