import { parseISO } from 'date-fns'
import type { AlnScreenerList, AlnScreenerResponseDto } from 'dto'
import type {
  ALNScreenerResponse,
  ALNScreeners,
  ChallengeResponse,
  StrengthResponse,
} from 'supportAdditionalNeedsApiClient'
import toReferenceAndAuditable from './referencedAndAuditableMapper'
import { toStrengthResponseDto } from './strengthResponseDtoMapper'
import { toChallengeResponseDto } from './challengeDtoMapper'

const toAlnScreenerList = (alnScreeners: ALNScreeners, prisonNumber: string): AlnScreenerList => ({
  prisonNumber,
  screeners:
    ((alnScreeners?.screeners || []) as Array<ALNScreenerResponse>).map(screener =>
      toAlnScreenerResponseDto(prisonNumber, screener),
    ) || [],
})

const toAlnScreenerResponseDto = (
  prisonNumber: string,
  alnScreenerResponse: ALNScreenerResponse,
): AlnScreenerResponseDto => ({
  ...toReferenceAndAuditable(alnScreenerResponse),
  screenerDate: parseISO(alnScreenerResponse.screenerDate),
  challenges: ((alnScreenerResponse.challenges || []) as Array<ChallengeResponse>).map(challenge =>
    toChallengeResponseDto(prisonNumber, challenge),
  ),
  strengths: ((alnScreenerResponse.strengths || []) as Array<StrengthResponse>).map(strength =>
    toStrengthResponseDto(prisonNumber, strength),
  ),
})

export { toAlnScreenerList, toAlnScreenerResponseDto }
