declare module 'dto' {
  export interface EducationSupportPlanDto {
    prisonNumber: string
    prisonId: string
    planCreatedByLoggedInUser?: boolean
    planCreatedByOtherFullName?: string
    planCreatedByOtherJobRole?: string
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
  }
}
