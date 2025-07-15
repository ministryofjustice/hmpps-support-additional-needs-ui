import type { ChallengeDto } from 'dto'
import ChallengeIdentificationSource from '../enums/challengeIdentificationSource'

const aValidChallengeDto = (options?: {
  prisonNumber?: string
  prisonId?: string
  challengeTypeCode?: string
  symptoms?: string
  howIdentified?: Array<ChallengeIdentificationSource>
  howIdentifiedOther?: string
}): ChallengeDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  challengeTypeCode: options?.challengeTypeCode || 'READING_COMPREHENSION',
  symptoms: options?.symptoms === null ? null : options?.symptoms || 'John struggles to read text on white background',
  howIdentified: options?.howIdentified || [ChallengeIdentificationSource.CONVERSATIONS],
  howIdentifiedOther:
    options?.howIdentifiedOther === null
      ? null
      : options?.howIdentifiedOther || 'The trainer noticed that John could read better on a cream background',
})

export default aValidChallengeDto
