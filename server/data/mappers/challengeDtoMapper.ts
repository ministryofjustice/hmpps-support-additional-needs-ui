import type { ChallengeListResponse, ChallengeResponse } from 'supportAdditionalNeedsApiClient'
import type { ChallengeResponseDto } from 'dto'
import { parseISO } from 'date-fns'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toChallengeDto = (prisonNumber: string, apiResponse: ChallengeListResponse): ChallengeResponseDto[] => {
  return ((apiResponse?.challenges || []) as Array<ChallengeResponse>).map(challenge =>
    toChallengeResponseDto(prisonNumber, challenge),
  )
}

const toChallengeResponseDto = (prisonNumber: string, challenge: ChallengeResponse): ChallengeResponseDto => {
  return challenge
    ? {
        ...toReferenceAndAuditable(challenge),
        prisonNumber,
        fromALNScreener: challenge.fromALNScreener,
        challengeTypeCode: challenge.challengeType.code,
        challengeCategory: challenge.challengeType.categoryCode,
        symptoms: challenge.symptoms,
        howIdentified: challenge.howIdentified,
        active: challenge.active,
        howIdentifiedOther: challenge.howIdentifiedOther,
        alnScreenerDate: challenge.alnScreenerDate ? parseISO(challenge.alnScreenerDate) : null,
        archiveReason: challenge.archiveReason,
      }
    : null
}

export { toChallengeDto, toChallengeResponseDto }
