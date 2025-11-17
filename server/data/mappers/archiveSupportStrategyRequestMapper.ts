import type { ArchiveSupportStrategyRequest } from 'supportAdditionalNeedsApiClient'
import type { SupportStrategyDto } from 'dto'

const toArchiveSupportStrategyRequest = (condition: SupportStrategyDto): ArchiveSupportStrategyRequest => ({
  prisonId: condition.prisonId,
  archiveReason: condition.archiveReason,
})

export default toArchiveSupportStrategyRequest
