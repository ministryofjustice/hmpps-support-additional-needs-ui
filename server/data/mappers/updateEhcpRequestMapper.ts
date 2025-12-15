import type { UpdateEhcpRequest } from 'supportAdditionalNeedsApiClient'
import type { EhcpStatusDto } from 'dto'

const toUpdateEhcpRequest = (dto: EhcpStatusDto): UpdateEhcpRequest => ({
  hasCurrentEhcp: dto.hasCurrentEhcp,
  prisonId: dto.prisonId,
})

export default toUpdateEhcpRequest
