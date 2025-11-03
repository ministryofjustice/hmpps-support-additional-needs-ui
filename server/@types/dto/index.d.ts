declare module 'dto' {
  import PlanCreationScheduleStatus from '../../enums/planCreationScheduleStatus'
  import PlanCreationScheduleExemptionReason from '../../enums/planCreationScheduleExemptionReason'
  import ConditionSource from '../../enums/conditionSource'
  import ChallengeIdentificationSource from '../../enums/challengeIdentificationSource'
  import StrengthIdentificationSource from '../../enums/strengthIdentificationSource'
  import ChallengeType from '../../enums/challengeType'
  import StrengthType from '../../enums/strengthType'
  import ChallengeCategory from '../../enums/challengeCategory'
  import StrengthCategory from '../../enums/strengthCategory'
  import SupportStrategyType from '../../enums/supportStrategyType'
  import AlnAssessmentReferral from '../../enums/alnAssessmentReferral'
  import PlanActionStatus from '../../enums/planActionStatus'

  /**
   * Interface defining common reference and audit related properties that DTO types can inherit through extension.
   */
  interface ReferencedAndAuditable {
    reference?: string
    createdBy?: string
    createdByDisplayName?: string
    createdAt?: Date
    createdAtPrison?: string
    updatedBy?: string
    updatedByDisplayName?: string
    updatedAt?: Date
    updatedAtPrison?: string
  }

  export interface EducationSupportPlanDto extends ReferencedAndAuditable {
    prisonNumber: string
    prisonId: string
    reviewExistingNeeds?: boolean
    planCreatedByLoggedInUser?: boolean
    planCreatedByOtherFullName?: string
    planCreatedByOtherJobRole?: string
    wereOtherPeopleConsulted?: boolean
    otherPeopleConsulted?: Array<{
      name: string
      jobRole: string
    }>
    teachingAdjustmentsNeeded?: boolean
    teachingAdjustments?: string
    specificTeachingSkillsNeeded?: boolean
    specificTeachingSkills?: string
    examArrangementsNeeded?: boolean
    examArrangements?: string
    hasCurrentEhcp?: boolean
    lnspSupportNeeded?: boolean
    lnspSupport?: string
    lnspSupportHours?: number
    reviewDate?: Date
    individualSupport?: string
    additionalInformation?: string
  }

  export interface ReviewEducationSupportPlanDto extends ReferencedAndAuditable {
    prisonNumber: string
    prisonId: string
    planReviewedByLoggedInUser?: boolean
    planReviewedByOtherFullName?: string
    planReviewedByOtherJobRole?: string
    wereOtherPeopleConsulted?: boolean
    otherPeopleConsulted?: Array<{
      name: string
      jobRole: string
    }>
    prisonerViewOnProgress?: string
    prisonerDeclinedBeingPartOfReview?: boolean
    reviewersViewOnProgress?: string
    teachingAdjustmentsNeeded?: boolean
    teachingAdjustments?: string
    specificTeachingSkillsNeeded?: boolean
    specificTeachingSkills?: string
    examArrangementsNeeded?: boolean
    examArrangements?: string
    additionalInformation?: string
    lnspSupportNeeded?: boolean
    lnspSupport?: string
    lnspSupportHours?: number
    reviewExistingNeeds?: boolean
    reviewDate?: Date
  }

  export interface PlanCreationScheduleDto {
    prisonNumber: string
    status: PlanCreationScheduleStatus
    deadlineDate?: Date
  }

  export interface RefuseEducationSupportPlanDto {
    prisonNumber: string
    prisonId: string
    reason: PlanCreationScheduleExemptionReason
    details?: string
  }

  /**
   * DTO representing a Challenge that has not yet been recorded for the person. IE. this DTO does not hold data about Challenges that the API has returned for this person.
   */
  export interface ChallengeDto {
    prisonNumber: string
    prisonId: string
    challengeTypeCode: ChallengeType
    symptoms?: string
    howIdentified?: Array<ChallengeIdentificationSource>
    howIdentifiedOther?: string
  }

  /**
   * DTO representing a Challenge that the person has. IE. this DTO does not hold data about Challenges that will be passed to the API to create.
   */
  export interface ChallengeResponseDto extends ReferencedAndAuditable {
    prisonNumber: string
    fromALNScreener: boolean
    challengeTypeCode: ChallengeType
    challengeCategory: ChallengeCategory
    active: boolean
    symptoms?: string
    howIdentified?: Array<ChallengeIdentificationSource>
    howIdentifiedOther?: string
    alnScreenerDate?: Date
  }

  export interface ConditionsList {
    prisonNumber: string
    conditions: Array<ConditionDto>
  }

  export interface ConditionDto extends ReferencedAndAuditable {
    prisonId?: string
    conditionTypeCode: ConditionType
    conditionName?: string
    conditionDetails: string
    source: ConditionSource
    active?: boolean
  }

  /**
   * DTO representing a Strength that has not yet been recorded for the person. IE. this DTO does not hold data about Strengths that the API has returned for this person.
   */
  export interface StrengthDto {
    prisonNumber: string
    prisonId: string
    strengthTypeCode: StrengthType
    symptoms?: string
    howIdentified?: Array<StrengthIdentificationSource>
    howIdentifiedOther?: string
  }

  export interface StrengthsList {
    prisonNumber: string
    strengths: Array<StrengthResponseDto>
  }

  /**
   * DTO representing a Strength that the person has. IE. this DTO does not hold data about Strengths that will be passed to the API to create.
   */
  export interface StrengthResponseDto extends ReferencedAndAuditable {
    prisonNumber: string
    strengthTypeCode: StrengthType
    strengthCategory: StrengthCategory
    symptoms?: string
    howIdentified?: Array<StrengthIdentificationSource>
    howIdentifiedOther?: string
    active: boolean
    fromALNScreener: boolean
    alnScreenerDate?: Date
  }

  /**
   * DTO representing a Support Strategy that has not yet been recorded for the person. IE. this DTO does not hold data about Support Strategies that the API has returned for this person.
   */
  export interface SupportStrategyDto {
    prisonNumber: string
    prisonId: string
    supportStrategyTypeCode?: SupportStrategyType
    supportStrategyDetails?: string
  }

  /**
   * Response DTO representing a Support Strategy that the person has.
   */
  export interface SupportStrategyResponseDto extends ReferencedAndAuditable {
    supportStrategyTypeCode?: SupportStrategyType
    supportStrategyDetails?: string
    supportStrategyCategory?: string
    active: boolean
  }

  export interface ReferenceDataItemDto {
    code: string
    areaCode?: string
  }

  export interface AlnScreenerList {
    prisonNumber: string
    screeners: Array<AlnScreenerResponseDto>
  }

  /**
   * DTO representing an ALN Screener that has already been recorded. IE. this DTO does not hold data about an ALN Screener that will be passed to the API to create.
   */
  export interface AlnScreenerResponseDto extends ReferencedAndAuditable {
    screenerDate: Date
    challenges: Array<ChallengeResponseDto>
    strengths: Array<StrengthResponseDto>
  }

  /**
   * DTO representing an ALN Screener that has not yet been recorded for the person. IE. this DTO does not hold data about ALN Screeners that the API has returned for this person.
   */
  export interface AlnScreenerDto {
    prisonNumber: string
    prisonId: string
    screenerDate?: Date
    challenges?: Array<ChallengeType>
    strengths?: Array<StrengthType>
  }

  /**
   * DTO collating the Additional Learning Needs (ALN) and Learning Difficulties and Disabilities (LDD) assessments that have been recorded in Curious
   */
  export interface CuriousAlnAndLddAssessmentsDto {
    lddAssessments: Array<CuriousLddAssessmentDto>
    alnAssessments: Array<CuriousAlnAssessmentDto>
  }

  /**
   * DTO representing a Learning Difficulties and Disabilities (LDD) assessment that has been recorded in Curious
   */
  export interface CuriousLddAssessmentDto {
    prisonId: string
    rapidAssessmentDate: Date
    inDepthAssessmentDate: Date
    primaryLddAndHealthNeed: string
    additionalLddAndHealthNeeds: Array<string>
  }

  /**
   * DTO representing an Additional Learning Needs (ALN) assessment that has been recorded in Curious
   */
  export interface CuriousAlnAssessmentDto {
    prisonId: string
    assessmentDate: Date
    referral: AlnAssessmentReferral
    supportPlanRequired: boolean // TODO - come up with a better name. This is Curious' view on whether a support plan is required, not ours. It does not account for whether the prisoner is in education and/or has other needs
  }

  /**
   * DTO representing the status and supporting data of the Prisoner's Education Support Plan lifecycle.
   * It does NOT represent the status of the plan itself (though there is an overlap), as the status property additionally
   * describes the status of the review schedule if plan is at that point in its lifecycle.
   *
   * The primary use case of this DTO is to determine the ELSP actions applicable to the prisoner's plan for the purpose
   * of the Actions menu.
   */
  export interface PlanLifecycleStatusDto {
    status: PlanActionStatus
    // Plan Creation Dateline Date - only set if the ELSP is due or overdue
    planCreationDeadlineDate?: Date
    // Review Dateline Date - only set if the ELSP has been created and therefore is in the Review cycle
    reviewDeadlineDate?: Date
    // If the creation of the ELSP was declined by the prisoner, this object describes the reason. Only set if the status property is PLAN_DECLINED
    planDeclined?: {
      reason: PlanCreationScheduleExemptionReason
      details: string
      recordedBy: string
      recordedAt: Date
    }
  }
}
