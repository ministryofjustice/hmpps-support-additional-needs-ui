import type { ConditionDto } from 'dto'
import ConditionSource from '../enums/conditionSource'

const aValidConditionDto = (options?: {
  prisonNumber?: string
  prisonId?: string
  conditionTypeCode?: string
  source?: ConditionSource
  detail?: string
}): ConditionDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  conditionTypeCode: options?.conditionTypeCode || 'DYSLEXIA',
  source: options?.source || ConditionSource.SELF_DECLARED,
  detail:
    options?.detail === null
      ? null
      : options?.detail || 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
})

export default aValidConditionDto
