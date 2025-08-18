import type { CreateSupportStrategiesRequest, SupportStrategyRequest } from 'supportAdditionalNeedsApiClient'

const aValidCreateSupportStrategiesRequest = (options?: {
  supportStrategies?: Array<SupportStrategyRequest>
}): CreateSupportStrategiesRequest => ({
  supportStrategies: options?.supportStrategies || [aValidSupportStrategyRequest()],
})

const aValidSupportStrategyRequest = (options?: {
  prisonId?: string
  supportStrategyTypeCode?: string
  detail?: string
}): SupportStrategyRequest => ({
  prisonId: options?.prisonId || 'BXI',
  supportStrategyTypeCode: options?.supportStrategyTypeCode || 'MEMORY',
  detail: options?.detail === null ? null : options?.detail || 'Using flash cards with John can help him retain facts',
})

export { aValidSupportStrategyRequest, aValidCreateSupportStrategiesRequest }
