import type { UpdateChallengeRequest } from 'supportAdditionalNeedsApiClient'
import ChallengeIdentificationSource from '../enums/challengeIdentificationSource'

const anUpdateChallengeRequest = (options?: {
  prisonId?: string
  symptoms?: string
  howIdentified?: Array<ChallengeIdentificationSource>
  howIdentifiedOther?: string
}): UpdateChallengeRequest => ({
  prisonId: options?.prisonId || 'BXI',
  symptoms: options?.symptoms === null ? null : options?.symptoms || 'John struggles to read text on white background',
  howIdentified: options?.howIdentified || [ChallengeIdentificationSource.CONVERSATIONS],
  howIdentifiedOther:
    options?.howIdentifiedOther === null
      ? null
      : options?.howIdentifiedOther || 'The trainer noticed that John could read better on a cream background',
})

export default anUpdateChallengeRequest
