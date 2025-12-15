import type { UpdateEhcpRequest } from 'supportAdditionalNeedsApiClient'
import type { EducationSupportPlanDto } from 'dto'

const toUpdateEhcpRequest = (dto: EducationSupportPlanDto): UpdateEhcpRequest => ({
  hasCurrentEhcp: dto.hasCurrentEhcp,
  prisonId: dto.prisonId,
})

export default toUpdateEhcpRequest
