import type { CreateConditionsRequest, ConditionRequest } from 'supportAdditionalNeedsApiClient'
import type { ConditionDto } from 'dto'

const toCreateConditionsRequest = (conditions: Array<ConditionDto>): CreateConditionsRequest => ({
  conditions: conditions.map(toCreateConditionRequest),
})

const toCreateConditionRequest = (condition: ConditionDto): ConditionRequest => ({
  prisonId: condition.prisonId,
  conditionTypeCode: condition.conditionTypeCode,
  source: condition.source,
  conditionName: condition.conditionName,
  conditionDetails: condition.conditionDetails,
})

export { toCreateConditionsRequest, toCreateConditionRequest }
