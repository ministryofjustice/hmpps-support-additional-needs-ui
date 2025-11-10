import type { ArchiveConditionRequest } from 'supportAdditionalNeedsApiClient'

const anArchiveConditionRequest = (options?: { prisonId?: string; reason?: string }): ArchiveConditionRequest => ({
  prisonId: options?.prisonId || 'BXI',
  archiveReason: options?.reason || 'John no longer has this condition',
})

export default anArchiveConditionRequest
