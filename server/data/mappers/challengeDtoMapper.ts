import type { ChallengeListResponse, ChallengeResponse } from 'supportAdditionalNeedsApiClient'
import type { ChallengeResponseDto } from 'dto'
import { parseISO } from 'date-fns'
import { toReferenceDataItem } from './referenceDataListResponseMapper'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toChallengeDto = (prisonNumber: string, apiResponse: ChallengeListResponse): ChallengeResponseDto[] => {
  return (apiResponse.challenges as Array<ChallengeResponse>).map(challenge =>
    toChallengeResponseDto(challenge, prisonNumber),
  )
}

const toChallengeResponseDto = (challenge: ChallengeResponse, prisonNumber: string = null): ChallengeResponseDto => {
  return {
    ...toReferenceAndAuditable(challenge),
    prisonNumber,
    fromALNScreener: challenge.fromALNScreener,
    challengeType: toReferenceDataItem(challenge.challengeType),
    challengeCategory: challenge.challengeType.categoryCode,
    symptoms: challenge.symptoms,
    howIdentified: challenge.howIdentified,
    active: challenge.active,
    howIdentifiedOther: challenge.howIdentifiedOther,
    alnScreenerDate: challenge.alnScreenerDate ? parseISO(challenge.alnScreenerDate) : null,
    challengeTypeCode: challenge.challengeType.code,
  } as ChallengeResponseDto
}

export { toChallengeDto, toChallengeResponseDto }
