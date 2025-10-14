import { addMonths, startOfToday } from 'date-fns'
import type { ReviewEducationSupportPlanDto } from 'dto'
import aValidPlanContributor from './planContributorTestDataBuilder'
import { DtoAuditFields, validDtoAuditFields } from './auditFieldsTestDataBuilder'

const aValidReviewEducationSupportPlanDto = (
  options?: DtoAuditFields & {
    prisonNumber?: string
    prisonId?: string
    reviewExistingNeeds?: boolean
    planReviewedByOther?: {
      name: string
      jobRole: string
    }
    otherPeopleConsulted?: Array<{
      name: string
      jobRole: string
    }>
    prisonerViewOnProgress?: string
    prisonerDeclinedBeingPartOfReview?: boolean
    reviewersViewOnProgress?: string
    reviewDate?: Date
    teachingAdjustments?: string
    specificTeachingSkills?: string
    examArrangements?: string
    additionalInformation?: string
    lnspSupport?: string
    lnspSupportHours?: number
  },
): ReviewEducationSupportPlanDto => ({
  prisonNumber: options?.prisonNumber ?? 'A1234BC',
  prisonId: options?.prisonId === null ? null : options?.prisonId || 'BXI',
  reviewExistingNeeds: options?.reviewExistingNeeds === null ? null : options?.reviewExistingNeeds || true,
  planReviewedByLoggedInUser: options?.planReviewedByOther == null,
  planReviewedByOtherFullName: options?.planReviewedByOther?.name,
  planReviewedByOtherJobRole: options?.planReviewedByOther?.jobRole,
  wereOtherPeopleConsulted: !(options?.otherPeopleConsulted === null || options?.otherPeopleConsulted?.length === 0),
  otherPeopleConsulted: !(options?.otherPeopleConsulted === null || options?.otherPeopleConsulted?.length === 0)
    ? options?.otherPeopleConsulted || [aValidPlanContributor()]
    : null,
  prisonerViewOnProgress:
    options?.prisonerDeclinedBeingPartOfReview === true
      ? null
      : options?.prisonerViewOnProgress || 'Chris is happy with his progress',
  prisonerDeclinedBeingPartOfReview: options?.prisonerDeclinedBeingPartOfReview === true,
  reviewersViewOnProgress: options?.reviewersViewOnProgress || 'Chris has made incredible progress',
  reviewDate: options?.reviewDate === null ? null : options?.reviewDate || addMonths(startOfToday(), 2),
  teachingAdjustmentsNeeded: options?.teachingAdjustments !== null,
  teachingAdjustments:
    options?.teachingAdjustments === null
      ? null
      : options?.teachingAdjustments || 'Use simpler examples to help students understand concepts',
  specificTeachingSkillsNeeded: options?.specificTeachingSkills !== null,
  specificTeachingSkills:
    options?.specificTeachingSkills === null
      ? null
      : options?.specificTeachingSkills || 'Teacher with BSL proficiency required',
  examArrangementsNeeded: options?.examArrangements !== null,
  examArrangements:
    options?.examArrangements === null
      ? null
      : options?.examArrangements || 'Escort to the exam room 10 minutes before everyone else',
  additionalInformation:
    options?.additionalInformation === null
      ? null
      : options?.additionalInformation || 'Chris is very open about his issues and is a pleasure to talk to.',
  lnspSupportNeeded: options?.lnspSupport !== null,
  lnspSupport:
    options?.lnspSupport === null
      ? null
      : options?.lnspSupport || 'Chris will need text reading to him as he cannot read himself',
  lnspSupportHours: options?.lnspSupport === null ? null : (options?.lnspSupportHours ?? 10),
  ...validDtoAuditFields(options),
})

export default aValidReviewEducationSupportPlanDto
