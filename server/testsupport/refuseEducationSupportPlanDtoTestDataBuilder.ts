import type { RefuseEducationSupportPlanDto } from 'dto'
import PlanCreationScheduleExemptionReason from '../enums/planCreationScheduleExemptionReason'

const aValidRefuseEducationSupportPlanDto = (options?: {
  prisonNumber?: string
  prisonId?: string
  reason?: PlanCreationScheduleExemptionReason
  details?: string
}): RefuseEducationSupportPlanDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  reason:
    options?.reason === null ? null : options?.reason || PlanCreationScheduleExemptionReason.EXEMPT_REFUSED_TO_ENGAGE,
  details:
    options?.details === null
      ? null
      : options?.details || 'Chris failed to engage and would not cooperate to setup a plan',
})

export default aValidRefuseEducationSupportPlanDto
