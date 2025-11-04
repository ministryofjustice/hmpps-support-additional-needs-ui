import type { UpdateSupportStrategyRequest } from 'supportAdditionalNeedsApiClient'

const anUpdateSupportStrategyRequest = (options?: {
  prisonId?: string
  detail?: string
}): UpdateSupportStrategyRequest => ({
  prisonId: options?.prisonId || 'BXI',
  detail: options?.detail === null ? null : options?.detail || 'Using flash cards with John can help him retain facts',
})

export default anUpdateSupportStrategyRequest
