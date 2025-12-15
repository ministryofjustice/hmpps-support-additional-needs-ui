import type { EhcpStatusDto } from 'dto'
import type { EhcpStatusResponse } from 'supportAdditionalNeedsApiClient'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toEhcpStatusDto = (ehcpStatusResponse: EhcpStatusResponse): EhcpStatusDto =>
  ehcpStatusResponse
    ? {
        hasCurrentEhcp: ehcpStatusResponse.hasCurrentEhcp,
        ...toReferenceAndAuditable(ehcpStatusResponse),
        prisonId: null,
      }
    : null

export default toEhcpStatusDto
