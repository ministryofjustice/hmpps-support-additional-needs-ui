declare module 'dto' {
  import PlanCreationScheduleStatus from '../../enums/planCreationScheduleStatus'
  import PlanCreationScheduleExemptionReason from '../../enums/planCreationScheduleExemptionReason'
  import ConditionSource from '../../enums/conditionSource'
  import ChallengeIdentificationSource from '../../enums/challengeIdentificationSource'
  import StrengthIdentificationSource from '../../enums/strengthIdentificationSource'
  import ChallengeType from '../../enums/challengeType'
  import StrengthType from '../../enums/strengthType'

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

  export interface ConditionsList {
    prisonNumber: string
    conditions: Array<ConditionDto>
  }

  export interface ConditionDto {
    prisonId: string
    conditionTypeCode: ConditionType
    conditionName?: string
    conditionDetails: string
    source: ConditionSource
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
