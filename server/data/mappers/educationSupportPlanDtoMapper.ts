import type { EducationSupportPlanDto } from 'dto'
import type { EducationSupportPlanResponse } from 'supportAdditionalNeedsApiClient'

const toEducationSupportPlanDto = (
  prisonNumber: string,
  educationSupportPlanResponse: EducationSupportPlanResponse,
): EducationSupportPlanDto => ({
  prisonNumber,
  planCreatedByLoggedInUser: educationSupportPlanResponse.planCreatedBy == null,
  planCreatedByOtherFullName: educationSupportPlanResponse.planCreatedBy?.name,
  planCreatedByOtherJobRole: educationSupportPlanResponse.planCreatedBy?.jobRole,
  wereOtherPeopleConsulted:
    educationSupportPlanResponse.otherContributors != null && educationSupportPlanResponse.otherContributors.length > 0,
  otherPeopleConsulted:
    educationSupportPlanResponse.otherContributors != null && educationSupportPlanResponse.otherContributors.length > 0
      ? educationSupportPlanResponse.otherContributors
      : null,
  hasCurrentEhcp: educationSupportPlanResponse.hasCurrentEhcp,
  learningEnvironmentAdjustmentsNeeded: educationSupportPlanResponse.learningEnvironmentAdjustments != null,
  learningEnvironmentAdjustments: educationSupportPlanResponse.learningEnvironmentAdjustments,
  teachingAdjustmentsNeeded: educationSupportPlanResponse.teachingAdjustments != null,
  teachingAdjustments: educationSupportPlanResponse.teachingAdjustments,
  specificTeachingSkillsNeeded: educationSupportPlanResponse.specificTeachingSkills != null,
  specificTeachingSkills: educationSupportPlanResponse.specificTeachingSkills,
  examArrangementsNeeded: educationSupportPlanResponse.examAccessArrangements != null,
  examArrangements: educationSupportPlanResponse.examAccessArrangements,
  lnspSupportNeeded: educationSupportPlanResponse.lnspSupport != null,
  lnspSupport: educationSupportPlanResponse.lnspSupport,
  prisonId: null,
  reviewDate: null,
})

export default toEducationSupportPlanDto
