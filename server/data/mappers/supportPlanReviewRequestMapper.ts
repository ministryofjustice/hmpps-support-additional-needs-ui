import { format } from 'date-fns'
import type { SupportPlanReviewRequest, UpdateEducationSupportPlanRequest } from 'supportAdditionalNeedsApiClient'
import type { EducationSupportPlanDto, ReviewEducationSupportPlanDto } from 'dto'

const toSupportPlanReviewRequest = (
  reviewEducationSupportPlanDto: ReviewEducationSupportPlanDto,
  educationSupportPlanDto: EducationSupportPlanDto,
): SupportPlanReviewRequest => ({
  prisonId: reviewEducationSupportPlanDto.prisonId,
  reviewCreatedBy: !reviewEducationSupportPlanDto.planReviewedByLoggedInUser
    ? {
        name: reviewEducationSupportPlanDto.planReviewedByOtherFullName,
        jobRole: reviewEducationSupportPlanDto.planReviewedByOtherJobRole,
      }
    : null,
  otherContributors: reviewEducationSupportPlanDto.wereOtherPeopleConsulted
    ? reviewEducationSupportPlanDto.otherPeopleConsulted
    : null,
  prisonerFeedback: reviewEducationSupportPlanDto.prisonerViewOnProgress || null,
  prisonerDeclinedFeedback: reviewEducationSupportPlanDto.prisonerDeclinedBeingPartOfReview === true,
  reviewerFeedback: reviewEducationSupportPlanDto.reviewersViewOnProgress,
  updateEducationSupportPlan: toUpdateEducationSupportPlanRequest(
    anyChangesToSupportPlan(reviewEducationSupportPlanDto, educationSupportPlanDto),
    reviewEducationSupportPlanDto,
  ),
  nextReviewDate: format(reviewEducationSupportPlanDto.reviewDate, 'yyyy-MM-dd'),
})

const toUpdateEducationSupportPlanRequest = (
  anyChanges: boolean,
  reviewEducationSupportPlanDto: ReviewEducationSupportPlanDto,
): UpdateEducationSupportPlanRequest => ({
  anyChanges,
  ...(anyChanges
    ? {
        teachingAdjustments: reviewEducationSupportPlanDto.teachingAdjustmentsNeeded
          ? reviewEducationSupportPlanDto.teachingAdjustments
          : null,
        specificTeachingSkills: reviewEducationSupportPlanDto.specificTeachingSkillsNeeded
          ? reviewEducationSupportPlanDto.specificTeachingSkills
          : null,
        examAccessArrangements: reviewEducationSupportPlanDto.examArrangementsNeeded
          ? reviewEducationSupportPlanDto.examArrangements
          : null,
        lnspSupport: reviewEducationSupportPlanDto.lnspSupportNeeded ? reviewEducationSupportPlanDto.lnspSupport : null,
        lnspSupportHours: reviewEducationSupportPlanDto.lnspSupportNeeded
          ? reviewEducationSupportPlanDto.lnspSupportHours
          : null,
        detail: reviewEducationSupportPlanDto.additionalInformation
          ? reviewEducationSupportPlanDto.additionalInformation
          : null,
      }
    : {}),
})

/**
 * Returns 'true' if the [ReviewEducationSupportPlanDto] would result in a change to the prisoner's ELSP
 * The significant questions/sections of the ELSP are:
 *   * teaching adjustments (teachingAdjustmentsNeeded and teachingAdjustments properties)
 *   * teaching skills (specificTeachingSkillsNeeded and specificTeachingSkills properties)
 *   * exam access arrangements (examArrangementsNeeded and examArrangements properties)
 *   * LNSP support (lnspSupportNeeded, lnspSupport and lnspSupportHours properties)
 *   * Additional information (additionalInformation property)
 *
 * If any of the above properties have changed then it represents a change to the prisoner's ELSP
 */
const anyChangesToSupportPlan = (
  reviewEducationSupportPlanDto: ReviewEducationSupportPlanDto,
  educationSupportPlanDto: EducationSupportPlanDto,
): boolean => {
  return (
    educationSupportPlanDto.teachingAdjustmentsNeeded !== reviewEducationSupportPlanDto.teachingAdjustmentsNeeded ||
    educationSupportPlanDto.teachingAdjustments !== reviewEducationSupportPlanDto.teachingAdjustments ||
    educationSupportPlanDto.specificTeachingSkillsNeeded !==
      reviewEducationSupportPlanDto.specificTeachingSkillsNeeded ||
    educationSupportPlanDto.specificTeachingSkills !== reviewEducationSupportPlanDto.specificTeachingSkills ||
    educationSupportPlanDto.examArrangementsNeeded !== reviewEducationSupportPlanDto.examArrangementsNeeded ||
    educationSupportPlanDto.examArrangements !== reviewEducationSupportPlanDto.examArrangements ||
    educationSupportPlanDto.lnspSupportNeeded !== reviewEducationSupportPlanDto.lnspSupportNeeded ||
    educationSupportPlanDto.lnspSupport !== reviewEducationSupportPlanDto.lnspSupport ||
    educationSupportPlanDto.lnspSupportHours !== reviewEducationSupportPlanDto.lnspSupportHours ||
    educationSupportPlanDto.additionalInformation !== reviewEducationSupportPlanDto.additionalInformation
  )
}

export { toSupportPlanReviewRequest, toUpdateEducationSupportPlanRequest }
