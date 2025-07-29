import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type {
  AlnScreenerRequest,
  ChallengeListResponse,
  ConditionListResponse,
  CreateChallengesRequest,
  CreateConditionsRequest,
  CreateEducationSupportPlanRequest,
  CreateStrengthsRequest,
  EducationSupportPlanResponse,
  PlanCreationSchedulesResponse,
  ReferenceDataListResponse,
  SearchByPrisonResponse,
  StrengthListResponse,
  UpdatePlanCreationStatusRequest,
} from 'supportAdditionalNeedsApiClient'
import config from '../config'
import logger from '../../logger'
import SearchSortField from '../enums/searchSortField'
import SearchSortDirection from '../enums/searchSortDirection'
import restClientErrorHandler from './restClientErrorHandler'
import ReferenceDataDomain from '../enums/referenceDataDomain'

export default class SupportAdditionalNeedsApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Support Additional Needs API Client', config.apis.supportAdditionalNeedsApi, logger, authenticationClient)
  }

  async getReferenceData(
    username: string,
    domain: ReferenceDataDomain,
    options: { categoriesOnly: boolean; includeInactive: boolean } = { categoriesOnly: false, includeInactive: false },
  ): Promise<ReferenceDataListResponse> {
    return this.get<ReferenceDataListResponse>(
      {
        path: `/reference-data/${domain}${options.categoriesOnly ? '/categories' : ''}`,
        query: {
          includeInactive: options.includeInactive,
        },
      },
      asSystem(username),
    )
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
    includeAllHistory: boolean = true,
  ): Promise<PlanCreationSchedulesResponse> {
    return this.get<PlanCreationSchedulesResponse>(
      {
        path: `/profile/${prisonNumber}/plan-creation-schedule`,
        query: {
          includeAllHistory,
        },
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async updateEducationSupportPlanCreationScheduleStatus(
    prisonNumber: string,
    username: string,
    updatePlanCreationStatusRequest: UpdatePlanCreationStatusRequest,
  ): Promise<PlanCreationSchedulesResponse> {
    return this.patch<PlanCreationSchedulesResponse>(
      {
        path: `/profile/${prisonNumber}/plan-creation-schedule/status`,
        data: updatePlanCreationStatusRequest,
      },
      asSystem(username),
    )
  }

  async createChallenges(
    prisonNumber: string,
    username: string,
    createChallengesRequest: CreateChallengesRequest,
  ): Promise<ChallengeListResponse> {
    return this.post<ChallengeListResponse>(
      {
        path: `/profile/${prisonNumber}/challenges`,
        data: createChallengesRequest,
      },
      asSystem(username),
    )
  }

  async getChallenges(prisonNumber: string, username: string): Promise<ChallengeListResponse> {
    return this.get<ChallengeListResponse>(
      {
        path: `/profile/${prisonNumber}/challenges`,
      },
      asSystem(username),
    )
  }

  async createConditions(
    prisonNumber: string,
    username: string,
    createConditionsRequest: CreateConditionsRequest,
  ): Promise<ConditionListResponse> {
    return this.post<ConditionListResponse>(
      {
        path: `/profile/${prisonNumber}/conditions`,
        data: createConditionsRequest,
      },
      asSystem(username),
    )
  }

  async createStrengths(
    prisonNumber: string,
    username: string,
    createStrengthsRequest: CreateStrengthsRequest,
  ): Promise<StrengthListResponse> {
    return this.post<StrengthListResponse>(
      {
        path: `/profile/${prisonNumber}/strengths`,
        data: createStrengthsRequest,
      },
      asSystem(username),
    )
  }

  async createAdditionalLearningNeedsScreener(
    prisonNumber: string,
    username: string,
    alnScreenerRequest: AlnScreenerRequest,
  ): Promise<void> {
    return this.post<void>(
      {
        path: `/profile/${prisonNumber}/aln-screener`,
        data: alnScreenerRequest,
      },
      asSystem(username),
    )
  }
}
