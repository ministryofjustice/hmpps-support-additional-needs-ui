import { startOfDay } from 'date-fns'
import type { PlanLifecycleStatusDto } from 'dto'
import PlanActionStatus from '../enums/planActionStatus'
import PlanCreationScheduleExemptionReason from '../enums/planCreationScheduleExemptionReason'

const aPlanLifecycleStatusDto = (options?: {
  status?: PlanActionStatus
  planCreationDeadlineDate?: Date
  reviewDeadlineDate?: Date
  planDeclined?: {
    reason: PlanCreationScheduleExemptionReason
    details: string
  }
}): PlanLifecycleStatusDto => ({
  status: options?.status || PlanActionStatus.PLAN_DECLINED,
  planCreationDeadlineDate:
    options?.planCreationDeadlineDate === null ? null : options?.planCreationDeadlineDate || startOfDay('2021-01-01'),
  reviewDeadlineDate:
    options?.reviewDeadlineDate === null ? null : options?.reviewDeadlineDate || startOfDay('2021-01-01'),
  planDeclined:
    options?.planDeclined === null
      ? null
      : {
          reason: options?.planDeclined?.reason || PlanCreationScheduleExemptionReason.EXEMPT_REFUSED_TO_ENGAGE,
          details: options?.planDeclined?.details || 'Chris feels he does not need a support plan',
        },
})

export default aPlanLifecycleStatusDto
