import type { UpdateSupportStrategyRequest } from 'supportAdditionalNeedsApiClient'
import type { SupportStrategyDto } from 'dto'

const toUpdateSupportStrategyRequest = (supportStrategy: SupportStrategyDto): UpdateSupportStrategyRequest => ({
  prisonId: supportStrategy.prisonId,
  detail: supportStrategy.supportStrategyDetails,
})

export default toUpdateSupportStrategyRequest
