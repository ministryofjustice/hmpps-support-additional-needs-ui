import { addMonths, format, startOfToday } from 'date-fns'
import type { PlanCreationScheduleResponse, PlanCreationSchedulesResponse } from 'supportAdditionalNeedsApiClient'
import PlanCreationScheduleStatus from '../enums/planCreationScheduleStatus'
import { validAuditFields, AuditFields } from './auditFieldsTestDataBuilder'

const aValidPlanCreationSchedulesResponse = (options?: {
  planCreationSchedules?: Array<PlanCreationScheduleResponse>
}): PlanCreationSchedulesResponse => ({
  planCreationSchedules: options?.planCreationSchedules || [aValidPlanCreationScheduleResponse()],
})

const aValidPlanCreationScheduleResponse = (
  options?: AuditFields & {
    deadlineDate?: Date
    status?: PlanCreationScheduleStatus
    exemptionReason?: string
    exemptionDetail?: string
    version?: number
  },
): PlanCreationScheduleResponse => ({
  deadlineDate:
    options?.deadlineDate === null ? null : format(options?.deadlineDate || addMonths(startOfToday(), 2), 'yyyy-MM-dd'),
  status: options?.status || PlanCreationScheduleStatus.SCHEDULED,
  exemptionReason: options?.exemptionReason,
  exemptionDetail: options?.exemptionDetail,
  version: options?.version || 0,
  ...validAuditFields(options),
})

export { aValidPlanCreationScheduleResponse, aValidPlanCreationSchedulesResponse }
