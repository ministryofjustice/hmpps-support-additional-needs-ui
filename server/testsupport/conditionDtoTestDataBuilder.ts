import type { ConditionDto } from 'dto'
import ConditionSource from '../enums/conditionSource'
import ConditionType from '../enums/conditionType'

const aValidConditionDto = (options?: {
  prisonNumber?: string
  prisonId?: string
  conditionTypeCode?: ConditionType
  conditionName?: string
  conditionDetails?: string
  source?: ConditionSource
}): ConditionDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  conditionTypeCode: options?.conditionTypeCode || ConditionType.DYSLEXIA,
  source: options?.source || ConditionSource.SELF_DECLARED,
  conditionDetails:
    options?.conditionDetails === null
      ? null
      : options?.conditionDetails ||
        'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
  conditionName: options?.conditionName === null ? null : options?.conditionName || 'Phonological dyslexia',
})

export default aValidConditionDto
