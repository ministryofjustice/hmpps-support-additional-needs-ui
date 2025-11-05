import type { UpdateConditionRequest } from 'supportAdditionalNeedsApiClient'
import type { ConditionDto } from 'dto'

const toUpdateConditionRequest = (condition: ConditionDto): UpdateConditionRequest => ({
  prisonId: condition.prisonId,
  source: condition.source,
  conditionDetails: condition.conditionDetails,
  conditionName: condition.conditionName,
})

export default toUpdateConditionRequest
