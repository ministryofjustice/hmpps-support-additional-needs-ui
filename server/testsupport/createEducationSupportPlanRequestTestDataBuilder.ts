import { addMonths, format, startOfToday } from 'date-fns'
import type { CreateEducationSupportPlanRequest, PlanContributor } from 'supportAdditionalNeedsApiClient'
import aValidPlanContributor from './planContributorTestDataBuilder'

const aValidCreateEducationSupportPlanRequest = (options?: {
  prisonId?: string
  hasCurrentEhcp?: boolean
  reviewDate?: Date
  planCreatedBy?: PlanContributor
  otherContributors?: Array<PlanContributor>
  teachingAdjustments?: string
  specificTeachingSkills?: string
  examAccessArrangements?: string
  lnspSupport?: string
  lnspSupportHours?: number
  individualSupport?: string
  detail?: string
}): CreateEducationSupportPlanRequest => ({
  prisonId: options?.prisonId || 'BXI',
  hasCurrentEhcp: options?.hasCurrentEhcp ?? false,
  reviewDate: format(options?.reviewDate || addMonths(startOfToday(), 2), 'yyyy-MM-dd'),
  planCreatedBy: options?.planCreatedBy === null ? null : options?.planCreatedBy || aValidPlanContributor(),
  otherContributors:
    options?.otherContributors == null || options?.otherContributors.length === 0
      ? null
      : options?.otherContributors || [aValidPlanContributor()],
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
  lnspSupportHours: options?.lnspSupport === null ? null : (options?.lnspSupportHours ?? 10),
  individualSupport:
    options?.individualSupport || 'Chris has asked that he is not sat with disruptive people as he is keen to learn',
  detail:
    options?.detail === null
      ? null
      : options?.detail || 'Chris is very open about his issues and is a pleasure to talk to.',
})

export default aValidCreateEducationSupportPlanRequest
