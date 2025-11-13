import type { ArchiveConditionRequest } from 'supportAdditionalNeedsApiClient'
import type { ConditionDto } from 'dto'

const toArchiveConditionRequest = (condition: ConditionDto): ArchiveConditionRequest => ({
  prisonId: condition.prisonId,
  archiveReason: condition.archiveReason,
})

export default toArchiveConditionRequest
