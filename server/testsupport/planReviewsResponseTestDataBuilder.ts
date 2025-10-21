import type {
  EducationSupportPlanReviewResponse,
  PlanReviewsResponse,
  ReviewContributor,
} from 'supportAdditionalNeedsApiClient'
import { AuditFields, validAuditFields } from './auditFieldsTestDataBuilder'
import aReviewContributor from './reviewContributorTestDataBuilder'

const aPlanReviewsResponse = (options?: {
  reviews?: Array<EducationSupportPlanReviewResponse>
}): PlanReviewsResponse => ({
  reviews: options?.reviews || [anEducationSupportPlanReviewResponse()],
})

const anEducationSupportPlanReviewResponse = (
  options?: AuditFields & {
    prisonerDeclinedFeedback?: boolean
    prisonerFeedback?: string
    reviewerFeedback?: string
    reviewCreatedBy?: ReviewContributor
    otherContributors?: Array<ReviewContributor>
  },
): EducationSupportPlanReviewResponse => ({
  prisonerDeclinedFeedback: options?.prisonerDeclinedFeedback == null ? false : options?.prisonerDeclinedFeedback,
  prisonerFeedback: options?.prisonerFeedback || 'I feel that I am progressing well',
  reviewerFeedback: options?.reviewerFeedback || 'Chris is attending classes and progressing as expected',
  reviewCreatedBy: options?.reviewCreatedBy === null ? null : options?.reviewCreatedBy || aReviewContributor(),
  otherContributors: options?.otherContributors === null ? null : options?.otherContributors || [aReviewContributor()],
  ...validAuditFields(options),
})

export { aPlanReviewsResponse, anEducationSupportPlanReviewResponse }
