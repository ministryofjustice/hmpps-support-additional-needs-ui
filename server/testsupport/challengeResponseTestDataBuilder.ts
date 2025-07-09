import { format, startOfToday, subMonths } from 'date-fns'
import type { ChallengeListResponse, ChallengeResponse } from 'supportAdditionalNeedsApiClient'
import validAuditFields from './auditFieldsTestDataBuilder'

const aValidChallengeListResponse = (options?: {
  challengeResponses?: Array<ChallengeResponse>
}): ChallengeListResponse => ({
  challenges: options?.challengeResponses || [aValidChallengeResponse()],
})

const aValidChallengeResponse = (options?: {
  reference?: string
  active?: boolean
  fromALNScreener?: boolean
  screeningDate?: Date
  challengeTypeCode?: string
  symptoms?: string
  howIdentified?: string
  createdBy?: string
  createdByDisplayName?: string
  createdAt?: string
  createdAtPrison?: string
  updatedBy?: string
  updatedByDisplayName?: string
  updatedAt?: string
  updatedAtPrison?: string
}): ChallengeResponse => ({
  reference: options?.reference || 'c88a6c48-97e2-4c04-93b5-98619966447b',
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
