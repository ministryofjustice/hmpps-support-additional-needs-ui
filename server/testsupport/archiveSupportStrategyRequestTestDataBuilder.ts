import type { ArchiveSupportStrategyRequest } from 'supportAdditionalNeedsApiClient'

const anArchiveSupportStrategyRequest = (options?: {
  prisonId?: string
  reason?: string
}): ArchiveSupportStrategyRequest => ({
  prisonId: options?.prisonId || 'BXI',
  archiveReason: options?.reason || 'This support strategy is no longer needed',
})

export default anArchiveSupportStrategyRequest
