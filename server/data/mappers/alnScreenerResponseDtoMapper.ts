import { parseISO } from 'date-fns'
import type { AlnScreenerList, AlnScreenerResponseDto } from 'dto'
import type {
  ALNScreenerResponse,
  ALNScreeners,
  ChallengeResponse,
  StrengthResponse,
} from 'supportAdditionalNeedsApiClient'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toAlnScreenerList = (alnScreeners: ALNScreeners, prisonNumber: string): AlnScreenerList => ({
  prisonNumber,
  screeners: alnScreeners?.screeners.map(toAlnScreenerResponseDto) || [],
})

const toAlnScreenerResponseDto = (alnScreenerResponse: ALNScreenerResponse): AlnScreenerResponseDto => ({
  ...toReferenceAndAuditable(alnScreenerResponse),
  screenerDate: parseISO(alnScreenerResponse.screenerDate),
  challenges: (alnScreenerResponse.challenges as Array<ChallengeResponse>).map(challenge => ({
    challengeTypeCode: challenge.challengeType.code,
    challengeCategory: challenge.challengeType.categoryCode,
  })),
  strengths: (alnScreenerResponse.strengths as Array<StrengthResponse>).map(strength => ({
    strengthTypeCode: strength.strengthType.code,
    strengthCategory: strength.strengthType.categoryCode,
  })),
})

export { toAlnScreenerList, toAlnScreenerResponseDto }
