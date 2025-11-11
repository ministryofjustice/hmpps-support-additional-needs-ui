import type { ArchiveChallengeRequest } from 'supportAdditionalNeedsApiClient'

const anArchiveChallengeRequest = (options?: { prisonId?: string; reason?: string }): ArchiveChallengeRequest => ({
  prisonId: options?.prisonId || 'BXI',
  archiveReason: options?.reason || 'John no longer feels he has this challenge',
})

export default anArchiveChallengeRequest
