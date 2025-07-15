import type { ChallengeRequest, CreateChallengesRequest } from 'supportAdditionalNeedsApiClient'
import ChallengeIdentificationSource from '../enums/challengeIdentificationSource'

const aValidCreateChallengesRequest = (options?: {
  challenges?: Array<ChallengeRequest>
}): CreateChallengesRequest => ({
  challenges: options?.challenges || [aValidChallengeRequest()],
})

const aValidChallengeRequest = (options?: {
  prisonId?: string
  challengeTypeCode?: string
  symptoms?: string
  howIdentified?: Array<ChallengeIdentificationSource>
  howIdentifiedOther?: string
}): ChallengeRequest => ({
  prisonId: options?.prisonId || 'BXI',
  challengeTypeCode: options?.challengeTypeCode || 'READING_COMPREHENSION',
  symptoms: options?.symptoms === null ? null : options?.symptoms || 'John struggles to read text on white background',
  howIdentified: options?.howIdentified || [ChallengeIdentificationSource.CONVERSATIONS],
  howIdentifiedOther:
    options?.howIdentifiedOther === null
      ? null
      : options?.howIdentifiedOther || 'The trainer noticed that John could read better on a cream background',
})

export { aValidChallengeRequest, aValidCreateChallengesRequest }
