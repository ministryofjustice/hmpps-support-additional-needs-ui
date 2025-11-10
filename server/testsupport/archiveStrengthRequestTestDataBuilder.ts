import type { ArchiveStrengthRequest } from 'supportAdditionalNeedsApiClient'

const anArchiveStrengthRequest = (options?: { prisonId?: string; reason?: string }): ArchiveStrengthRequest => ({
  prisonId: options?.prisonId || 'BXI',
  archiveReason: options?.reason || 'John no longer feels he has this strength',
})

export default anArchiveStrengthRequest
