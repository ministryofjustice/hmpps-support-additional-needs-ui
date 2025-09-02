import { parseISO } from 'date-fns'
import type { PlanLifecycleStatusDto } from 'dto'
import type { PlanActionStatus } from 'supportAdditionalNeedsApiClient'
import PlanActionStatusEnum from '../../enums/planActionStatus'

const toPlanLifecycleStatusDto = (planActionStatus: PlanActionStatus): PlanLifecycleStatusDto => ({
  status: planActionStatus?.status || PlanActionStatusEnum.NO_PLAN,
  planCreationDeadlineDate: planActionStatus?.planCreationDeadlineDate
    ? parseISO(planActionStatus.planCreationDeadlineDate)
    : null,
  reviewDeadlineDate: planActionStatus?.reviewDeadlineDate ? parseISO(planActionStatus.reviewDeadlineDate) : null,
  planDeclined: planActionStatus?.exemptionReason
    ? {
        reason: planActionStatus.exemptionReason,
        details: planActionStatus.exemptionDetail,
        recordedBy: planActionStatus.exemptionRecordedBy,
        recordedAt: parseISO(planActionStatus.exemptionRecordedAt),
      }
    : null,
})

export default toPlanLifecycleStatusDto
