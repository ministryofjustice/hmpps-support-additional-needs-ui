import { addMonths, format, startOfToday } from 'date-fns'
import type { PlanCreationScheduleResponse, PlanCreationSchedulesResponse } from 'supportAdditionalNeedsApiClient'
import PlanCreationScheduleStatus from '../enums/planCreationScheduleStatus'
import validAuditFields from './auditFieldsTestDataBuilder'

const aValidPlanCreationSchedulesResponse = (options?: {
  planCreationSchedules?: Array<PlanCreationScheduleResponse>
}): PlanCreationSchedulesResponse => ({
  planCreationSchedules: options?.planCreationSchedules || [aValidPlanCreationScheduleResponse()],
})

const aValidPlanCreationScheduleResponse = (options?: {
  reference?: string
  deadlineDate?: Date
  status?: PlanCreationScheduleStatus
  exemptionReason?: string
  exemptionDetail?: string
  version?: number
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: string
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: string
  updatedAtPrison?: string
}): PlanCreationScheduleResponse => ({
  reference: options?.reference || 'c88a6c48-97e2-4c04-93b5-98619966447b',
  deadlineDate:
    options?.deadlineDate === null ? null : format(options?.deadlineDate || addMonths(startOfToday(), 2), 'yyyy-MM-dd'),
  status: options?.status || PlanCreationScheduleStatus.SCHEDULED,
  exemptionReason: options?.exemptionReason,
  exemptionDetail: options?.exemptionDetail,
  version: options?.version || 0,
  ...validAuditFields(options),
})

export { aValidPlanCreationScheduleResponse, aValidPlanCreationSchedulesResponse }
