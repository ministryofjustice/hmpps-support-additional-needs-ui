import type { ChallengeDto } from 'dto'

const aValidChallengeDto = (options?: {
  prisonNumber?: string
  prisonId?: string
  challengeTypeCode?: string
  symptoms?: string
  howIdentified?: string
}): ChallengeDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  challengeTypeCode: options?.challengeTypeCode || 'READING_COMPREHENSION',
  symptoms: options?.symptoms === null ? null : options?.symptoms || 'John struggles to read text on white background',
  howIdentified:
    options?.howIdentified === null
      ? null
      : options?.howIdentified || 'The trainer noticed that John could read better on a cream background',
})

export default aValidChallengeDto
