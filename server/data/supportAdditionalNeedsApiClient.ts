import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type {
  AlnScreenerRequest,
  ALNScreeners,
  ChallengeListResponse,
  ConditionListResponse,
  CreateChallengesRequest,
  CreateConditionsRequest,
  CreateEducationSupportPlanRequest,
  CreateStrengthsRequest,
  CreateSupportStrategiesRequest,
  EducationSupportPlanResponse,
  PlanActionStatus,
  PlanCreationSchedulesResponse,
  PlanReviewsResponse,
  ReferenceDataListResponse,
  SearchByPrisonResponse,
  StrengthListResponse,
  SupportStrategyListResponse,
  SupportPlanReviewRequest,
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

  async getEducationSupportPlan(prisonNumber: string, username: string): Promise<EducationSupportPlanResponse> {
    return this.get<EducationSupportPlanResponse>(
      {
        path: `/profile/${prisonNumber}/education-support-plan`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
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

  async getConditions(prisonNumber: string, username: string): Promise<ConditionListResponse> {
    return this.get<ConditionListResponse>(
      {
        path: `/profile/${prisonNumber}/conditions`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
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

  async getStrengths(prisonNumber: string, username: string): Promise<StrengthListResponse> {
    return this.get<StrengthListResponse>(
      {
        path: `/profile/${prisonNumber}/strengths`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async createSupportStrategies(
    prisonNumber: string,
    username: string,
    createSupportStrategiesRequest: CreateSupportStrategiesRequest,
  ): Promise<SupportStrategyListResponse> {
    return this.post<SupportStrategyListResponse>(
      {
        path: `/profile/${prisonNumber}/support-strategies`,
        data: createSupportStrategiesRequest,
      },
      asSystem(username),
    )
  }

  async getSupportStrategies(prisonNumber: string, username: string): Promise<SupportStrategyListResponse> {
    return this.get<SupportStrategyListResponse>(
      {
        path: `/profile/${prisonNumber}/support-strategies`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
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

  async getAdditionalLearningNeedsScreeners(prisonNumber: string, username: string): Promise<ALNScreeners> {
    return this.get<ALNScreeners>(
      {
        path: `/profile/${prisonNumber}/aln-screener`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async getPlanActionStatus(prisonNumber: string, username: string): Promise<PlanActionStatus> {
    return this.get<PlanActionStatus>(
      {
        path: `/profile/${prisonNumber}/plan-action-status`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }

  async reviewEducationSupportPlan(
    prisonNumber: string,
    username: string,
    supportPlanReviewRequest: SupportPlanReviewRequest,
  ): Promise<void> {
    return this.post<void>(
      {
        path: `/profile/${prisonNumber}/education-support-plan/review`,
        data: supportPlanReviewRequest,
      },
      asSystem(username),
    )
  }

  async getEducationSupportPlanReviews(prisonNumber: string, username: string): Promise<PlanReviewsResponse> {
    return this.get<PlanReviewsResponse>(
      {
        path: `/profile/${prisonNumber}/education-support-plan/review`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }
}
