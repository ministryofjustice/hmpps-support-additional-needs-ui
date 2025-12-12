import type { UpdateEhcpRequest } from 'supportAdditionalNeedsApiClient'

const anUpdateEhcpRequest = (options?: { prisonId?: string; hasCurrentEhcp?: boolean }): UpdateEhcpRequest => ({
  prisonId: options?.prisonId || 'BXI',
  hasCurrentEhcp: options?.hasCurrentEhcp == null ? true : options.hasCurrentEhcp,
})

export default anUpdateEhcpRequest
