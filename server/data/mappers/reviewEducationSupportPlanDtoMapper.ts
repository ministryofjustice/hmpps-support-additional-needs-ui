import type { ReviewEducationSupportPlanDto } from 'dto'
import type { EducationSupportPlanReviewResponse, PlanReviewsResponse } from 'supportAdditionalNeedsApiClient'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toReviewEducationSupportPlanDtos = (
  prisonNumber: string,
  planReviewsResponse: PlanReviewsResponse,
): Array<ReviewEducationSupportPlanDto> =>
  ((planReviewsResponse?.reviews || []) as Array<EducationSupportPlanReviewResponse>).map(review =>
    toReviewEducationSupportPlanDto(prisonNumber, review),
  )

const toReviewEducationSupportPlanDto = (
  prisonNumber: string,
  educationSupportPlanReviewResponse: EducationSupportPlanReviewResponse,
): ReviewEducationSupportPlanDto => {
  return educationSupportPlanReviewResponse
    ? {
        prisonNumber,
        ...toReferenceAndAuditable(educationSupportPlanReviewResponse),
        planReviewedByLoggedInUser: educationSupportPlanReviewResponse.reviewCreatedBy == null,
        planReviewedByOtherFullName: educationSupportPlanReviewResponse.reviewCreatedBy?.name,
        planReviewedByOtherJobRole: educationSupportPlanReviewResponse.reviewCreatedBy?.jobRole,
        wereOtherPeopleConsulted:
          educationSupportPlanReviewResponse.otherContributors != null &&
          educationSupportPlanReviewResponse.otherContributors.length > 0,
        otherPeopleConsulted:
          educationSupportPlanReviewResponse.otherContributors != null &&
          educationSupportPlanReviewResponse.otherContributors.length > 0
            ? educationSupportPlanReviewResponse.otherContributors
            : null,
        prisonerViewOnProgress: educationSupportPlanReviewResponse.prisonerFeedback,
        prisonerDeclinedBeingPartOfReview: educationSupportPlanReviewResponse.prisonerDeclinedFeedback,
        reviewersViewOnProgress: educationSupportPlanReviewResponse.reviewerFeedback,
        prisonId: null,
        reviewDate: null,
        reviewExistingNeeds: null,
        teachingAdjustmentsNeeded: null,
        teachingAdjustments: null,
        specificTeachingSkillsNeeded: null,
        specificTeachingSkills: null,
        examArrangementsNeeded: null,
        examArrangements: null,
        additionalInformation: null,
        lnspSupportNeeded: null,
        lnspSupport: null,
        lnspSupportHours: null,
      }
    : null
}

export default toReviewEducationSupportPlanDtos
