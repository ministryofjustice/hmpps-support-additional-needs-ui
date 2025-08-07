import { startOfToday, subDays } from 'date-fns'
import type { AlnScreenerDto, AlnScreenerList, AlnScreenerResponseDto, StrengthResponseDto } from 'dto'
import ChallengeType from '../enums/challengeType'
import StrengthType from '../enums/strengthType'
import ChallengeCategory from '../enums/challengeCategory'
import { DtoAuditFields, validDtoAuditFields } from './auditFieldsTestDataBuilder'
import { aValidStrengthResponseDto } from './strengthResponseDtoTestDataBuilder'
import { aValidChallengeResponse } from './challengeResponseTestDataBuilder'

const aValidAlnScreenerList = (options?: {
  prisonNumber?: string
  screeners?: Array<AlnScreenerResponseDto>
}): AlnScreenerList => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  screeners: options?.screeners || [aValidAlnScreenerResponseDto()],
})

const aValidAlnScreenerResponseDto = (
  options?: DtoAuditFields & {
    screenerDate?: Date
    challenges?: Array<{ challengeTypeCode: ChallengeType; challengeCategory: ChallengeCategory }>
    strengths?: Array<StrengthResponseDto>
  },
): AlnScreenerResponseDto => ({
  screenerDate: options?.screenerDate || subDays(startOfToday(), 1),
  challenges: options?.challenges || aValidChallengeResponse(),
  strengths: options?.strengths || [aValidStrengthResponseDto()],
  ...validDtoAuditFields(options),
})

const aValidAlnScreenerDto = (options?: {
  prisonNumber?: string
  prisonId?: string
  screenerDate?: Date
  challenges?: Array<ChallengeType>
  strengths?: Array<StrengthType>
}): AlnScreenerDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  screenerDate: options?.screenerDate === null ? null : options?.screenerDate || subDays(startOfToday(), 1),
  challenges:
    options?.challenges === null
      ? null
      : options?.challenges || [ChallengeType.ARITHMETIC, ChallengeType.MATHS_CONFIDENCE],
  strengths:
    options?.strengths === null ? null : options?.strengths || [StrengthType.TIDINESS, StrengthType.CREATIVITY],
})

export { aValidAlnScreenerDto, aValidAlnScreenerList, aValidAlnScreenerResponseDto }
