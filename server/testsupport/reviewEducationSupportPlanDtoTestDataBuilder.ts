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
    options?.prisonerDeclinedBeingPartOfReview === false
      ? null
      : options?.prisonerViewOnProgress || 'Chris is happy with his progress',
  prisonerDeclinedBeingPartOfReview:
    options?.prisonerDeclinedBeingPartOfReview === false ? false : options?.prisonerDeclinedBeingPartOfReview || true,
  reviewersViewOnProgress: options?.reviewersViewOnProgress || 'Chris has made incredible progress',
  reviewDate: options?.reviewDate === null ? null : options?.reviewDate || addMonths(startOfToday(), 2),
  ...validDtoAuditFields(options),
})

export default aValidReviewEducationSupportPlanDto
