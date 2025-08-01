import type { ChallengeListResponse, ChallengeResponse } from 'supportAdditionalNeedsApiClient'
import type { ChallengeResponseDto } from 'dto'
import { toReferenceDataItem } from './referenceDataListResponseMapper'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toChallengeDto = (prisonNumber: string, apiResponse: ChallengeListResponse): ChallengeResponseDto[] => {
  return (apiResponse.challenges as Array<ChallengeResponse>).map(
    challenge =>
      ({
        ...toReferenceAndAuditable(challenge),
        prisonNumber,
        fromALNScreener: challenge.fromALNScreener,
        challengeType: toReferenceDataItem(challenge.challengeType),
        symptoms: challenge.symptoms,
        howIdentified: challenge.howIdentified,
        active: challenge.active,
        howIdentifiedOther: challenge.howIdentifiedOther,
      }) as ChallengeResponseDto,
  )
}

export default toChallengeDto
