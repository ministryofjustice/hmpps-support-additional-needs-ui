import type { CreateSupportStrategiesRequest, SupportStrategyRequest } from 'supportAdditionalNeedsApiClient'
import type { SupportStrategyDto } from 'dto'

const toCreateSupportStrategiesRequest = (
  supportStrategies: Array<SupportStrategyDto>,
): CreateSupportStrategiesRequest => ({
  supportStrategies: supportStrategies.map(toCreateSupportStrategyRequest),
})

const toCreateSupportStrategyRequest = (supportStrategy: SupportStrategyDto): SupportStrategyRequest => ({
  prisonId: supportStrategy.prisonId,
  supportStrategyTypeCode: supportStrategy.supportStrategyTypeCode,
  detail: supportStrategy.supportStrategyDetails,
})

export { toCreateSupportStrategiesRequest, toCreateSupportStrategyRequest }
