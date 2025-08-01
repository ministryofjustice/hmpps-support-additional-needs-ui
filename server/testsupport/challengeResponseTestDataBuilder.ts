import { format, startOfToday, subMonths } from 'date-fns'
import type { ChallengeListResponse, ChallengeResponse } from 'supportAdditionalNeedsApiClient'
import validAuditFields, { AuditFields } from './auditFieldsTestDataBuilder'

const aValidChallengeListResponse = (options?: {
  challengeResponses?: Array<ChallengeResponse>
}): ChallengeListResponse => ({
  challenges: options?.challengeResponses || [aValidChallengeResponse()],
})

const aValidChallengeResponse = (
  options?: AuditFields & {
    active?: boolean
    fromALNScreener?: boolean
    screeningDate?: Date
    challengeTypeCode?: string
    symptoms?: string
    howIdentified?: string
  },
): ChallengeResponse => ({
  active: options?.active == null ? true : options?.active,
  fromALNScreener: options?.fromALNScreener == null ? true : options?.fromALNScreener,
  screeningDate:
    options?.screeningDate === null
      ? null
      : format(options?.screeningDate || subMonths(startOfToday(), 1), 'yyyy-MM-dd'),
  symptoms: options?.symptoms === null ? null : options?.symptoms || 'John struggles to read text on white background',
  howIdentified:
    options?.howIdentified === null
      ? null
      : options?.howIdentified || 'The trainer noticed that John could read better on a cream background',
  challengeType: {
    code: options?.challengeTypeCode || 'READING_COMPREHENSION',
  },
  ...validAuditFields(options),
})

export { aValidChallengeResponse, aValidChallengeListResponse }
