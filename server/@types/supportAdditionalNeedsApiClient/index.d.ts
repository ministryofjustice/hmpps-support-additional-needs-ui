declare module 'supportAdditionalNeedsApiClient' {
  import { components } from '../supportAdditionalNeedsApi'

  export type PaginationMetaData = components['schemas']['PaginationMetaData']
  export type Person = components['schemas']['Person']
  export type SearchByPrisonResponse = components['schemas']['SearchByPrisonResponse']
  export type CreateEducationSupportPlanRequest = components['schemas']['CreateEducationSupportPlanRequest']
  export type EducationSupportPlanResponse = components['schemas']['EducationSupportPlanResponse']
  export type PlanContributor = components['schemas']['PlanContributor']

  export type PlanCreationSchedulesResponse = components['schemas']['PlanCreationSchedulesResponse']
  export type PlanCreationScheduleResponse = components['schemas']['PlanCreationScheduleResponse']
  export type UpdatePlanCreationStatusRequest = components['schemas']['UpdatePlanCreationStatusRequest']

  export type CreateChallengesRequest = components['schemas']['CreateChallengesRequest']
  export type ChallengeRequest = components['schemas']['ChallengeRequest']
  export type ChallengeListResponse = components['schemas']['ChallengeListResponse']
  export type ChallengeResponse = components['schemas']['ChallengeResponse']

  export type CreateConditionsRequest = components['schemas']['CreateConditionsRequest']
  export type ConditionRequest = components['schemas']['ConditionRequest']
  export type ConditionListResponse = components['schemas']['ConditionListResponse']
  export type ConditionResponse = components['schemas']['ConditionResponse']

  export type CreateStrengthsRequest = components['schemas']['CreateStrengthsRequest']
  export type StrengthRequest = components['schemas']['StrengthRequest']
  export type StrengthListResponse = components['schemas']['StrengthListResponse']
  export type StrengthResponse = components['schemas']['StrengthResponse']

  export type CreateSupportStrategiesRequest = components['schemas']['CreateSupportStrategiesRequest']
  export type SupportStrategyRequest = components['schemas']['SupportStrategyRequest']
  export type SupportStrategyListResponse = components['schemas']['SupportStrategyListResponse']
  export type SupportStrategyResponse = components['schemas']['SupportStrategyResponse']

  export type ReferenceDataListResponse = components['schemas']['ReferenceDataListResponse']
  export type ReferenceData = components['schemas']['ReferenceData']

  export type ALNScreeners = components['schemas']['ALNScreeners']
  export type ALNScreenerResponse = components['schemas']['ALNScreenerResponse']

  export type AlnScreenerRequest = components['schemas']['ALNScreenerRequest']
  export type AlnChallenge = components['schemas']['ALNChallenge']
  export type AlnStrength = components['schemas']['ALNStrength']

  export type PlanActionStatus = components['schemas']['PlanActionStatus']

  export type SupportPlanReviewRequest = components['schemas']['SupportPlanReviewRequest']
  export type UpdateEducationSupportPlanRequest = components['schemas']['UpdateEducationSupportPlanRequest']
}
