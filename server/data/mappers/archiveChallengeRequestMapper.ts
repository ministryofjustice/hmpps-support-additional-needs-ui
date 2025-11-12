import type { ArchiveChallengeRequest } from 'supportAdditionalNeedsApiClient'
import type { ChallengeDto } from 'dto'

const toArchiveChallengeRequest = (challenge: ChallengeDto): ArchiveChallengeRequest => ({
  prisonId: challenge.prisonId,
  archiveReason: challenge.archiveReason,
})

export default toArchiveChallengeRequest
