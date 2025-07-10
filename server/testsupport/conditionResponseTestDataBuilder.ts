import type { ConditionListResponse, ConditionResponse } from 'supportAdditionalNeedsApiClient'
import validAuditFields from './auditFieldsTestDataBuilder'
import ConditionSource from '../enums/conditionSource'

const aValidConditionListResponse = (options?: {
  conditionResponses?: Array<ConditionResponse>
}): ConditionListResponse => ({
  conditions: options?.conditionResponses || [aValidConditionResponse()],
})

const aValidConditionResponse = (options?: {
  reference?: string
  active?: boolean
  conditionTypeCode?: string
  source?: ConditionSource
  detail?: string
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: string
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: string
  updatedAtPrison?: string
}): ConditionResponse => ({
  reference: options?.reference || 'c88a6c48-97e2-4c04-93b5-98619966447b',
  active: options?.active == null ? true : options?.active,
  source: options?.source || ConditionSource.SELF_DECLARED,
  detail:
    options?.detail === null
      ? null
      : options?.detail || 'John says he was diagnosed with dyslexia as a child, but this has not yet been evidenced.',
  conditionType: {
    code: options?.conditionTypeCode || 'DYSLEXIA',
  },
  ...validAuditFields(options),
})

export { aValidConditionResponse, aValidConditionListResponse }
