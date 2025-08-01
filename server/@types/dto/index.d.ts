declare module 'dto' {
  import PlanCreationScheduleStatus from '../../enums/planCreationScheduleStatus'
  import PlanCreationScheduleExemptionReason from '../../enums/planCreationScheduleExemptionReason'
  import ConditionSource from '../../enums/conditionSource'
  import ChallengeIdentificationSource from '../../enums/challengeIdentificationSource'
  import StrengthIdentificationSource from '../../enums/strengthIdentificationSource'
  import ChallengeType from '../../enums/challengeType'
  import StrengthType from '../../enums/strengthType'

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

  export interface EducationSupportPlanDto {
    prisonNumber: string
    prisonId: string
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
    reviewDate?: Date
    individualSupport?: string
    additionalInformation?: string
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

  export interface ChallengeDto {
    prisonNumber: string
    prisonId: string
    challengeTypeCode: ChallengeType
    symptoms?: string
    howIdentified?: Array<ChallengeIdentificationSource>
    howIdentifiedOther?: string
  }

  export interface ChallengeResponseDto extends ReferencedAndAuditable {
    prisonNumber: string
    fromALNScreener: boolean
    challengeType: ReferenceDataItemDto
    active: boolean
    symptoms?: string
    howIdentified?: (
      | 'EDUCATION_SKILLS_WORK'
      | 'WIDER_PRISON'
      | 'CONVERSATIONS'
      | 'COLLEAGUE_INFO'
      | 'FORMAL_PROCESSES'
      | 'SELF_DISCLOSURE'
      | 'OTHER_SCREENING_TOOL'
      | 'OTHER'
    )[]
    howIdentifiedOther?: string
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

  export interface StrengthDto {
    prisonNumber: string
    prisonId: string
    strengthTypeCode: StrengthType
    symptoms?: string
    howIdentified?: Array<StrengthIdentificationSource>
    howIdentifiedOther?: string
  }

  export interface ReferenceDataItemDto {
    code: string
    areaCode?: string
  }

  export interface AlnScreenerDto {
    prisonNumber: string
    prisonId: string
    screenerDate?: Date
    challenges?: Array<ChallengeType>
    strengths?: Array<StrengthType>
  }
}
