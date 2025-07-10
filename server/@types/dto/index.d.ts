declare module 'dto' {
  import PlanCreationScheduleStatus from '../../enums/planCreationScheduleStatus'
  import PlanCreationScheduleExemptionReason from '../../enums/planCreationScheduleExemptionReason'
  import ConditionSource from '../../enums/conditionSource'

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
    learningEnvironmentAdjustmentsNeeded?: boolean
    learningEnvironmentAdjustments?: string
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
    challengeTypeCode: string
    symptoms?: string
    howIdentified?: string
  }

  export interface ConditionDto {
    prisonNumber: string
    prisonId: string
    conditionTypeCode: string
    source: ConditionSource
    detail?: string
  }
}
