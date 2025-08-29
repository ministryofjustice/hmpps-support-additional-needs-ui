import type { EducationSupportPlanDto } from 'dto'
import type { EducationSupportPlanResponse } from 'supportAdditionalNeedsApiClient'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toEducationSupportPlanDto = (
  prisonNumber: string,
  educationSupportPlanResponse: EducationSupportPlanResponse,
): EducationSupportPlanDto => {
  return educationSupportPlanResponse
    ? {
        prisonNumber,
        ...toReferenceAndAuditable(educationSupportPlanResponse),
        planCreatedByLoggedInUser: educationSupportPlanResponse.planCreatedBy == null,
        planCreatedByOtherFullName: educationSupportPlanResponse.planCreatedBy?.name,
        planCreatedByOtherJobRole: educationSupportPlanResponse.planCreatedBy?.jobRole,
        wereOtherPeopleConsulted:
          educationSupportPlanResponse.otherContributors != null &&
          educationSupportPlanResponse.otherContributors.length > 0,
        otherPeopleConsulted:
          educationSupportPlanResponse.otherContributors != null &&
          educationSupportPlanResponse.otherContributors.length > 0
            ? educationSupportPlanResponse.otherContributors
            : null,
        hasCurrentEhcp: educationSupportPlanResponse.hasCurrentEhcp,
        teachingAdjustmentsNeeded: educationSupportPlanResponse.teachingAdjustments != null,
        teachingAdjustments: educationSupportPlanResponse.teachingAdjustments,
        specificTeachingSkillsNeeded: educationSupportPlanResponse.specificTeachingSkills != null,
        specificTeachingSkills: educationSupportPlanResponse.specificTeachingSkills,
        examArrangementsNeeded: educationSupportPlanResponse.examAccessArrangements != null,
        examArrangements: educationSupportPlanResponse.examAccessArrangements,
        lnspSupportNeeded: educationSupportPlanResponse.lnspSupport != null,
        lnspSupport: educationSupportPlanResponse.lnspSupport,
        lnspSupportHours: educationSupportPlanResponse.lnspSupportHours,
        individualSupport: educationSupportPlanResponse.individualSupport,
        additionalInformation: educationSupportPlanResponse.detail,
        prisonId: null,
        reviewDate: null,
      }
    : null
}

export default toEducationSupportPlanDto
