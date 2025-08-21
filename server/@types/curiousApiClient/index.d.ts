declare module 'curiousApiClient' {
  import { components } from '../curiousApi'

  export type AllAssessmentDTO = components['schemas']['AllAssessmentDTO']
  // Curious V1 Assessment Types
  export type LearnerLatestAssessmentV1DTO = components['schemas']['LearnerLatestAssessmentV1DTO']
  export type LearnerAssessmentV1DTO = components['schemas']['LearnerAssessmentV1DTO']
  export type LearnerLddInfoExternalV1DTO = components['schemas']['LearnerLddInfoExternalV1DTO']

  // Curious V2 Assessment Types
  export type LearnerAssessmentV2DTO = components['schemas']['LearnerAssessmentV2DTO']
  export type ExternalAssessmentsDTO = components['schemas']['ExternalAssessmentsDTO']
  export type LearnerAssessmentsDTO = components['schemas']['LearnerAssessmentsDTO']
  export type LearnerAssessmentsFunctionalSkillsDTO = components['schemas']['LearnerAssessmentsFunctionalSkillsDTO']
  export type LearnerAssessmentsAlnDTO = components['schemas']['LearnerAssessmentsAlnDTO']
}
