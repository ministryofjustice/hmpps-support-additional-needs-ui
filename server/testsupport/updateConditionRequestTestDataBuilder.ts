import type { UpdateConditionRequest } from 'supportAdditionalNeedsApiClient'
import ConditionSource from '../enums/conditionSource'

const anUpdateConditionRequest = (options?: {
  prisonId?: string
  source?: ConditionSource
  conditionDetails?: string
  conditionName?: string
}): UpdateConditionRequest => ({
  prisonId: options?.prisonId || 'BXI',
  source: options?.source || ConditionSource.SELF_DECLARED,
  conditionDetails:
    options?.conditionDetails === null
      ? null
      : options?.conditionDetails ||
        'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
  conditionName: options?.conditionName === null ? null : options?.conditionName || 'Phonological dyslexia',
})

export default anUpdateConditionRequest
