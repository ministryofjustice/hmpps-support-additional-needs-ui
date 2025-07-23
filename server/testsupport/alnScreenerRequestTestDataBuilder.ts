import type { AlnChallenge, AlnScreenerRequest, AlnStrength } from 'supportAdditionalNeedsApiClient'
import { format, startOfToday } from 'date-fns'

const aValidAlnScreenerRequest = (options?: {
  prisonId?: string
  screenerDate?: Date
  challenges?: Array<AlnChallenge>
  strengths?: Array<AlnStrength>
}): AlnScreenerRequest => ({
  prisonId: options?.prisonId || 'BXI',
  screenerDate: format(options?.screenerDate || startOfToday(), 'yyyy-MM-dd'),
  challenges: options?.challenges || [aValidAlnChallenge()],
  strengths: options?.strengths || [aValidAlnStrength()],
})

const aValidAlnChallenge = (options?: { challengeTypeCode?: string }): AlnChallenge => ({
  challengeTypeCode: options?.challengeTypeCode || 'WRITING',
})

const aValidAlnStrength = (options?: { strengthTypeCode?: string }): AlnStrength => ({
  strengthTypeCode: options?.strengthTypeCode || 'READING',
})

export { aValidAlnScreenerRequest, aValidAlnChallenge, aValidAlnStrength }
