import type { ArchiveStrengthRequest } from 'supportAdditionalNeedsApiClient'
import type { StrengthDto } from 'dto'

const toArchiveStrengthRequest = (strength: StrengthDto): ArchiveStrengthRequest => ({
  prisonId: strength.prisonId,
  archiveReason: strength.archiveReason,
})

export default toArchiveStrengthRequest
