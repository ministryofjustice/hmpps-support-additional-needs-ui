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
}): EducationSupportPlanResponse => ({
  hasCurrentEhcp: options?.hasCurrentEhcp ?? false,
  planCreatedBy: options?.planCreatedBy === null ? null : options?.planCreatedBy || aValidPlanContributor(),
  otherContributors:
    options?.otherContributors === null || options?.otherContributors.length === 0
      ? null
      : options?.otherContributors || [aValidPlanContributor()],
  learningEnvironmentAdjustments: options?.learningEnvironmentAdjustments || 'Needs to sit at the front of the class',
  teachingAdjustments: options?.teachingAdjustments || 'Use simpler examples to help students understand concepts',
  specificTeachingSkills: options?.specificTeachingSkills || 'Teacher with BSL proficiency required',
  examAccessArrangements: options?.examAccessArrangements || 'Escort to the exam room 10 minutes before everyone else',
  lnspSupport: options?.lnspSupport || 'Chris will need text reading to him as he cannot read himself',
  ...validAuditFields(options),
})

export default aValidEducationSupportPlanResponse
