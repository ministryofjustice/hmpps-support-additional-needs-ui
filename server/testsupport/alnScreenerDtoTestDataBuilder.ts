import { startOfToday, subDays } from 'date-fns'
import type { AlnScreenerDto } from 'dto'
import ChallengeType from '../enums/challengeType'

const aValidAlnScreenerDto = (options?: {
  prisonNumber?: string
  prisonId?: string
  screenerDate?: Date
  challenges?: Array<ChallengeType>
}): AlnScreenerDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  screenerDate: options?.screenerDate === null ? null : options?.screenerDate || subDays(startOfToday(), 1),
  challenges:
    options?.challenges === null
      ? null
      : options?.challenges || [ChallengeType.ARITHMETIC, ChallengeType.MATHS_CONFIDENCE],
})

export default aValidAlnScreenerDto
