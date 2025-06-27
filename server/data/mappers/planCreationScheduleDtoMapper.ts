import { parseISO } from 'date-fns'
import type { PlanCreationScheduleResponse } from 'supportAdditionalNeedsApiClient'
import type { PlanCreationScheduleDto } from 'dto'

const toPlanCreationScheduleDto = (
  prisonNumber: string,
  apiResponse: PlanCreationScheduleResponse,
): PlanCreationScheduleDto => ({
  prisonNumber,
  deadlineDate: apiResponse.deadlineDate ? parseISO(apiResponse.deadlineDate) : null,
  status: apiResponse.status,
})

export default toPlanCreationScheduleDto
