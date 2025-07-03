import type { EducationSupportPlanResponse, PlanContributor } from 'supportAdditionalNeedsApiClient'
import validAuditFields from './auditFieldsTestDataBuilder'
import aValidPlanContributor from './planContributorTestDataBuilder'

const aValidEducationSupportPlanResponse = (options?: {
  hasCurrentEhcp?: boolean
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: string
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: string
  updatedAtPrison?: string
  planCreatedBy?: PlanContributor
  otherContributors?: Array<PlanContributor>
  learningEnvironmentAdjustments?: string
  teachingAdjustments?: string
  specificTeachingSkills?: string
  examAccessArrangements?: string
  lnspSupport?: string
  individualSupport?: string
  detail?: string
}): EducationSupportPlanResponse => ({
  hasCurrentEhcp: options?.hasCurrentEhcp ?? false,
  planCreatedBy: options?.planCreatedBy === null ? null : options?.planCreatedBy || aValidPlanContributor(),
  otherContributors:
    options?.otherContributors === null || options?.otherContributors?.length === 0
      ? null
      : options?.otherContributors || [aValidPlanContributor()],
  learningEnvironmentAdjustments:
    options?.learningEnvironmentAdjustments === null
      ? null
      : options?.learningEnvironmentAdjustments || 'Needs to sit at the front of the class',
  teachingAdjustments:
    options?.teachingAdjustments === null
      ? null
      : options?.teachingAdjustments || 'Use simpler examples to help students understand concepts',
  specificTeachingSkills:
    options?.specificTeachingSkills === null
      ? null
      : options?.specificTeachingSkills || 'Teacher with BSL proficiency required',
  examAccessArrangements:
    options?.examAccessArrangements === null
      ? null
      : options?.examAccessArrangements || 'Escort to the exam room 10 minutes before everyone else',
  lnspSupport:
    options?.lnspSupport === null
      ? null
      : options?.lnspSupport || 'Chris will need text reading to him as he cannot read himself',
  individualSupport:
    options?.individualSupport || 'Chris has asked that he is not sat with disruptive people as he is keen to learn',
  detail:
    options?.detail === null
      ? null
      : options?.detail || 'Chris is very open about his issues and is a pleasure to talk to.',
  ...validAuditFields(options),
})

export default aValidEducationSupportPlanResponse
