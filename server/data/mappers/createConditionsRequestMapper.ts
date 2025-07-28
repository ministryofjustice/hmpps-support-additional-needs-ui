import type { CreateConditionsRequest, ConditionRequest } from 'supportAdditionalNeedsApiClient'
import type { ConditionDto, ConditionsList } from 'dto'

const toCreateConditionsRequest = (conditionList: ConditionsList): CreateConditionsRequest => ({
  conditions: conditionList.conditions.map(toCreateConditionRequest),
})

const toCreateConditionRequest = (condition: ConditionDto): ConditionRequest => ({
  prisonId: condition.prisonId,
  conditionTypeCode: condition.conditionTypeCode,
  source: condition.source,
  conditionName: condition.conditionName,
  conditionDetails: condition.conditionDetails,
})

export { toCreateConditionsRequest, toCreateConditionRequest }
