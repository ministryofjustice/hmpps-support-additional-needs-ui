import type { ConditionRequest, CreateConditionsRequest } from 'supportAdditionalNeedsApiClient'
import ConditionSource from '../enums/conditionSource'

const aValidCreateConditionsRequest = (options?: {
  conditions?: Array<ConditionRequest>
}): CreateConditionsRequest => ({
  conditions: options?.conditions || [aValidConditionRequest()],
})

const aValidConditionRequest = (options?: {
  prisonId?: string
  conditionTypeCode?: string
  source?: ConditionSource
  conditionDetails?: string
  conditionName?: string
}): ConditionRequest => ({
  prisonId: options?.prisonId || 'BXI',
  conditionTypeCode: options?.conditionTypeCode || 'DYSLEXIA',
  source: options?.source || ConditionSource.SELF_DECLARED,
  conditionDetails:
    options?.conditionDetails === null
      ? null
      : options?.conditionDetails ||
        'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
  conditionName: options?.conditionName === null ? null : options?.conditionName || 'Phonological dyslexia',
})

export { aValidConditionRequest, aValidCreateConditionsRequest }
