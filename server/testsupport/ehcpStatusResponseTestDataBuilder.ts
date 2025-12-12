import type { EhcpStatusResponse } from 'supportAdditionalNeedsApiClient'
import { AuditFields, validAuditFields } from './auditFieldsTestDataBuilder'

const anEhcpStatusResponse = (options?: AuditFields & { hasCurrentEhcp?: boolean }): EhcpStatusResponse => ({
  hasCurrentEhcp: options?.hasCurrentEhcp == null ? true : options.hasCurrentEhcp,
  ...validAuditFields(options),
})

export default anEhcpStatusResponse
