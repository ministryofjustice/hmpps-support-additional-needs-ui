import type { ConditionDto, ConditionsList } from 'dto'
import ConditionSource from '../enums/conditionSource'
import ConditionType from '../enums/conditionType'
import { DtoAuditFields, validDtoAuditFields } from './auditFieldsTestDataBuilder'

const aValidConditionsList = (options?: {
  prisonNumber?: string
  conditions?: Array<ConditionDto>
}): ConditionsList => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  conditions: options?.conditions || [aValidConditionDto()],
})

const aValidConditionDto = (
  options?: DtoAuditFields & {
    prisonId?: string
    prisonNumber?: string
    conditionTypeCode?: ConditionType
    conditionName?: string
    conditionDetails?: string
    source?: ConditionSource
    active?: boolean
    archiveReason?: string
  },
): ConditionDto => ({
  prisonId: options?.prisonId == null ? null : options?.prisonId || 'BXI',
  prisonNumber: options?.prisonNumber || 'A1234BC',
  conditionTypeCode: options?.conditionTypeCode || ConditionType.DYSLEXIA,
  source: options?.source || ConditionSource.SELF_DECLARED,
  conditionDetails:
    options?.conditionDetails === null
      ? null
      : options?.conditionDetails ||
        'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
  conditionName: options?.conditionName === null ? null : options?.conditionName || 'Phonological dyslexia',
  active: options?.active == null ? true : options?.active,
  archiveReason: options?.archiveReason,
  ...validDtoAuditFields(options),
})

export { aValidConditionDto, aValidConditionsList }
