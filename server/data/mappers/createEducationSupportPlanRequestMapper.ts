import { format } from 'date-fns'
import type { CreateEducationSupportPlanRequest } from 'supportAdditionalNeedsApiClient'
import type { EducationSupportPlanDto } from 'dto'

const toCreateEducationSupportPlanRequest = (dto: EducationSupportPlanDto): CreateEducationSupportPlanRequest => ({
  prisonId: dto.prisonId,
  hasCurrentEhcp: dto.hasCurrentEhcp,
  reviewDate: format(dto.reviewDate, 'yyyy-MM-dd'),
  planCreatedBy: !dto.planCreatedByLoggedInUser
    ? { name: dto.planCreatedByOtherFullName, jobRole: dto.planCreatedByOtherJobRole }
    : null,
  otherContributors: dto.wereOtherPeopleConsulted ? dto.otherPeopleConsulted : null,
  learningEnvironmentAdjustments: dto.learningEnvironmentAdjustmentsNeeded ? dto.learningEnvironmentAdjustments : null,
  teachingAdjustments: dto.teachingAdjustmentsNeeded ? dto.teachingAdjustments : null,
  specificTeachingSkills: dto.specificTeachingSkillsNeeded ? dto.specificTeachingSkills : null,
  examAccessArrangements: dto.examArrangementsNeeded ? dto.examArrangements : null,
  lnspSupport: dto.lnspSupportNeeded ? dto.lnspSupport : null,
  individualSupport: dto.individualSupport,
  detail: dto.additionalInformation ? dto.additionalInformation : null,
})

export default toCreateEducationSupportPlanRequest
