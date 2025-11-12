import type { ChallengeDto } from 'dto'
import ChallengeIdentificationSource from '../enums/challengeIdentificationSource'
import ChallengeType from '../enums/challengeType'

const aValidChallengeDto = (options?: {
  prisonNumber?: string
  prisonId?: string
  challengeTypeCode?: ChallengeType
  symptoms?: string
  howIdentified?: Array<ChallengeIdentificationSource>
  howIdentifiedOther?: string
  archiveReason?: string
}): ChallengeDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  challengeTypeCode: options?.challengeTypeCode || ChallengeType.READING_COMPREHENSION,
  symptoms: options?.symptoms === null ? null : options?.symptoms || 'John struggles to read text on white background',
  howIdentified: options?.howIdentified || [ChallengeIdentificationSource.CONVERSATIONS],
  howIdentifiedOther:
    options?.howIdentifiedOther === null
      ? null
      : options?.howIdentifiedOther || 'The trainer noticed that John could read better on a cream background',
  archiveReason: options?.archiveReason,
})

export default aValidChallengeDto
