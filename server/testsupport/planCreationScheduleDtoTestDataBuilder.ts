import { startOfToday } from 'date-fns'
import type { PlanCreationScheduleDto } from 'dto'
import PlanCreationScheduleStatus from '../enums/planCreationScheduleStatus'

const aValidPlanCreationScheduleDto = (options?: {
  prisonNumber?: string
  deadlineDate?: Date
  status?: PlanCreationScheduleStatus
}): PlanCreationScheduleDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  deadlineDate: options?.deadlineDate === null ? null : options?.deadlineDate || startOfToday(),
  status: options?.status || PlanCreationScheduleStatus.SCHEDULED,
})

export default aValidPlanCreationScheduleDto
