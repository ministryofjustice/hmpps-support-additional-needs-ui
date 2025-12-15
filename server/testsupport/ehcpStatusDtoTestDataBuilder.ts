import type { EhcpStatusDto } from 'dto'
import { DtoAuditFields, validDtoAuditFields } from './auditFieldsTestDataBuilder'

const anEhcpStatusDto = (
  options?: DtoAuditFields & {
    hasCurrentEhcp?: boolean
    prisonId?: string
  },
): EhcpStatusDto => ({
  hasCurrentEhcp: options?.hasCurrentEhcp == null ? true : options.hasCurrentEhcp,
  prisonId: options?.prisonId === null ? null : options?.prisonId || 'BXI',
  ...validDtoAuditFields(options),
})

export default anEhcpStatusDto
