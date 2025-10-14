import { addMonths, format, startOfToday } from 'date-fns'
import type {
  SupportPlanReviewRequest,
  PlanContributor,
  UpdateEducationSupportPlanRequest,
} from 'supportAdditionalNeedsApiClient'
import aValidPlanContributor from './planContributorTestDataBuilder'

const aSupportPlanReviewRequest = (options?: {
  prisonId?: string
  reviewCreatedBy?: PlanContributor
  otherContributors?: Array<PlanContributor>
  prisonerFeedback?: string
  reviewerFeedback?: string
  updateEducationSupportPlan?: UpdateEducationSupportPlanRequest
  nextReviewDate?: Date
}): SupportPlanReviewRequest => ({
  prisonId: options?.prisonId || 'BXI',
  reviewCreatedBy: options?.reviewCreatedBy === null ? null : options?.reviewCreatedBy || aValidPlanContributor(),
  otherContributors:
    options?.otherContributors == null || options?.otherContributors.length === 0
      ? null
      : options?.otherContributors || [aValidPlanContributor()],
  prisonerFeedback:
    options?.prisonerFeedback === null ? null : options?.prisonerFeedback || 'Chris is happy with his progress',
  prisonerDeclinedFeedback: options?.prisonerFeedback === null,
  reviewerFeedback: options?.reviewerFeedback || 'Chris is progressing well',
  updateEducationSupportPlan: options?.updateEducationSupportPlan || anUpdateEducationSupportPlanRequest(),
  nextReviewDate: format(options?.nextReviewDate || addMonths(startOfToday(), 2), 'yyyy-MM-dd'),
})

const anUpdateEducationSupportPlanRequest = (options?: {
  teachingAdjustments?: string
  specificTeachingSkills?: string
  examAccessArrangements?: string
  lnspSupport?: string
  lnspSupportHours?: number
  detail?: string
}): UpdateEducationSupportPlanRequest => ({
  anyChanges:
    options?.teachingAdjustments !== null ||
    options?.specificTeachingSkills !== null ||
    options?.examAccessArrangements !== null ||
    options?.lnspSupport !== null ||
    options?.lnspSupportHours !== null ||
    options?.detail !== null,
  teachingAdjustments:
    options?.teachingAdjustments === null
      ? undefined
      : options?.teachingAdjustments || 'Use simpler examples to help students understand concepts',
  specificTeachingSkills:
    options?.specificTeachingSkills === null
      ? undefined
      : options?.specificTeachingSkills || 'Teacher with BSL proficiency required',
  examAccessArrangements:
    options?.examAccessArrangements === null
      ? undefined
      : options?.examAccessArrangements || 'Escort to the exam room 10 minutes before everyone else',
  lnspSupport:
    options?.lnspSupport === null
      ? undefined
      : options?.lnspSupport || 'Chris will need text reading to him as he cannot read himself',
  lnspSupportHours: options?.lnspSupport === null ? undefined : (options?.lnspSupportHours ?? 10),
  detail:
    options?.detail === null
      ? undefined
      : options?.detail || 'Chris is very open about his issues and is a pleasure to talk to.',
})

export { aSupportPlanReviewRequest, anUpdateEducationSupportPlanRequest }
