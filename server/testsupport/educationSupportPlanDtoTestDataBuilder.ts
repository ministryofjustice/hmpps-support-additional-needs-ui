import { addMonths, startOfToday } from 'date-fns'
import type { EducationSupportPlanDto } from 'dto'
import aValidPlanContributor from './planContributorTestDataBuilder'
import { DtoAuditFields, validDtoAuditFields } from './auditFieldsTestDataBuilder'

const aValidEducationSupportPlanDto = (
  options?: DtoAuditFields & {
    prisonNumber?: string
    prisonId?: string
    planCreatedByOther?: {
      name: string
      jobRole: string
    }
    otherPeopleConsulted?: Array<{
      name: string
      jobRole: string
    }>
    hasCurrentEhcp?: boolean
    teachingAdjustments?: string
    specificTeachingSkills?: string
    examArrangements?: string
    lnspSupport?: string
    lnspSupportHours?: number
    reviewDate?: Date
    individualSupport?: string
    additionalInformation?: string
  },
): EducationSupportPlanDto => ({
  prisonNumber: options?.prisonNumber ?? 'A1234BC',
  prisonId: options?.prisonId === null ? null : options?.prisonId || 'BXI',
  planCreatedByLoggedInUser: options?.planCreatedByOther == null,
  planCreatedByOtherFullName: options?.planCreatedByOther?.name,
  planCreatedByOtherJobRole: options?.planCreatedByOther?.jobRole,
  wereOtherPeopleConsulted: !(options?.otherPeopleConsulted === null || options?.otherPeopleConsulted?.length === 0),
  otherPeopleConsulted: !(options?.otherPeopleConsulted === null || options?.otherPeopleConsulted?.length === 0)
    ? options?.otherPeopleConsulted || [aValidPlanContributor()]
    : null,
  hasCurrentEhcp: options?.hasCurrentEhcp ?? false,
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
  lnspSupportNeeded: options?.lnspSupport !== null,
  lnspSupport:
    options?.lnspSupport === null
      ? null
      : options?.lnspSupport || 'Chris will need text reading to him as he cannot read himself',
  lnspSupportHours: options?.lnspSupport === null ? null : (options?.lnspSupportHours ?? 10),
  reviewDate: options?.reviewDate === null ? null : options?.reviewDate || addMonths(startOfToday(), 2),
  individualSupport:
    options?.individualSupport || 'Chris has asked that he is not sat with disruptive people as he is keen to learn',
  additionalInformation:
    options?.additionalInformation === null
      ? null
      : options?.additionalInformation || 'Chris is very open about his issues and is a pleasure to talk to.',
  ...validDtoAuditFields(options),
})

export default aValidEducationSupportPlanDto
