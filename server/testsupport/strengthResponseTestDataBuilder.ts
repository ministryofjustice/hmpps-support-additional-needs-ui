import type { StrengthListResponse, StrengthResponse } from 'supportAdditionalNeedsApiClient'
import validAuditFields, { AuditFields } from './auditFieldsTestDataBuilder'
import StrengthIdentificationSource from '../enums/strengthIdentificationSource'

const aValidStrengthListResponse = (options?: { strengths?: Array<StrengthResponse> }): StrengthListResponse => ({
  strengths: options?.strengths || [aValidStrengthResponse()],
})

const aValidStrengthResponse = (
  options?: AuditFields & {
    active?: boolean
    fromALNScreener?: boolean
    strengthTypeCode?: string
    symptoms?: string
    howIdentified?: Array<StrengthIdentificationSource>
    howIdentifiedOther?: string
  },
): StrengthResponse => ({
  active: options?.active == null ? true : options?.active,
  fromALNScreener: options?.fromALNScreener == null ? true : options?.fromALNScreener,
  symptoms:
    options?.symptoms === null ? null : options?.symptoms || 'John can read and understand written language very well',
  howIdentified: options?.howIdentified || [StrengthIdentificationSource.CONVERSATIONS],
  howIdentifiedOther:
    options?.howIdentifiedOther === null
      ? null
      : options?.howIdentifiedOther || `John's reading strength was discovered during a poetry recital evening`,
  strengthType: {
    code: options?.strengthTypeCode || 'READING_COMPREHENSION',
  },
  ...validAuditFields(options),
})

export { aValidStrengthResponse, aValidStrengthListResponse }
