import { parseISO } from 'date-fns'
import type { ChallengeListResponse, ChallengeResponse } from 'supportAdditionalNeedsApiClient'
import type { ChallengeResponseDto } from 'dto'
import { toReferenceDataItem } from './referenceDataListResponseMapper'

const toChallengeDto = (prisonNumber: string, apiResponse: ChallengeListResponse): ChallengeResponseDto[] => {
  return (apiResponse.challenges as Array<ChallengeResponse>).map(
    challenge =>
      ({
        prisonNumber,
        reference: challenge.reference,
        fromALNScreener: challenge.fromALNScreener,
        challengeType: toReferenceDataItem(challenge.challengeType),
        symptoms: challenge.symptoms,
        createdAt: parseISO(challenge.createdAt),
        createdBy: challenge.createdBy,
        updatedAt: challenge.updatedAt ? parseISO(challenge.updatedAt) : null,
        updatedBy: challenge.updatedBy || null,
        howIdentified: challenge.howIdentified,
        createdAtPrison: challenge.createdAtPrison,
        updatedAtPrison: challenge.updatedAtPrison,
        createdByDisplayName: challenge.createdByDisplayName,
        updatedByDisplayName: challenge.updatedByDisplayName,
        active: challenge.active,
        howIdentifiedOther: challenge.howIdentifiedOther,
      }) as ChallengeResponseDto,
  )
}

export default toChallengeDto
