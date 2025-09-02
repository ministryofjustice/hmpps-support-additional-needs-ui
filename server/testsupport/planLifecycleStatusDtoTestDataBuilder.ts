import { parseISO, startOfDay } from 'date-fns'
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
    recordedBy: string
    recordedAt: Date
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
          recordedBy: options?.planDeclined?.recordedBy || 'Alex Smith',
          recordedAt: options?.planDeclined?.recordedAt || parseISO('2021-01-03T10:32:17.491Z'),
        },
})

export default aPlanLifecycleStatusDto
