import type { UpdatePlanCreationStatusRequest } from 'supportAdditionalNeedsApiClient'
import PlanCreationScheduleStatus from '../enums/planCreationScheduleStatus'
import PlanCreationScheduleExemptionReason from '../enums/planCreationScheduleExemptionReason'

const aValidUpdatePlanCreationStatusRequest = (options?: {
  prisonId?: string
  status?: PlanCreationScheduleStatus
  exemptionReason?: PlanCreationScheduleExemptionReason
  exemptionDetail?: string
}): UpdatePlanCreationStatusRequest => ({
  prisonId: options?.prisonId || 'BXI',
  status: options?.status || PlanCreationScheduleStatus.EXEMPT_PRISONER_NOT_COMPLY,
  exemptionReason:
    options?.exemptionReason === null
      ? null
      : options?.exemptionReason || PlanCreationScheduleExemptionReason.EXEMPT_REFUSED_TO_ENGAGE,
  exemptionDetail:
    options?.exemptionDetail === null
      ? null
      : options?.exemptionDetail || 'Chris feels he does not need a support plan',
})

export default aValidUpdatePlanCreationStatusRequest
