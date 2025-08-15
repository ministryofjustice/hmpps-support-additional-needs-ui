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
    lnspSupportHours?: number
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
    challengeType: ReferenceDataItemDto
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
    strengthTypeCode: StrengthType
    strengthCategory: StrengthCategory
    symptoms?: string
    howIdentified?: Array<StrengthIdentificationSource>
    howIdentifiedOther?: string
    active: boolean
    fromALNScreener: boolean
    alnScreenerDate?: Date
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
}
