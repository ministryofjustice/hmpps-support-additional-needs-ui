import type { UpdatePlanCreationStatusRequest } from 'supportAdditionalNeedsApiClient'
import type { RefuseEducationSupportPlanDto } from 'dto'
import PlanCreationScheduleStatus from '../../enums/planCreationScheduleStatus'

const toUpdatePlanCreationStatusRequest = (dto: RefuseEducationSupportPlanDto): UpdatePlanCreationStatusRequest => ({
  prisonId: dto.prisonId,
  status: PlanCreationScheduleStatus.EXEMPT_PRISONER_NOT_COMPLY,
  exemptionReason: dto.reason,
  exemptionDetail: dto.details,
})

export default toUpdatePlanCreationStatusRequest
