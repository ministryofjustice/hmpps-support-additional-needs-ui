declare module 'supportAdditionalNeedsApiClient' {
  import { components } from '../supportAdditionalNeedsApi'

  export type AdditionalNeedsSummary = components['schemas']['AdditionalNeedsSummary']
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
}
