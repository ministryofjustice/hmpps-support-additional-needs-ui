import type { CreateChallengesRequest, ChallengeRequest } from 'supportAdditionalNeedsApiClient'
import type { ChallengeDto } from 'dto'

const toCreateChallengesRequest = (challenges: Array<ChallengeDto>): CreateChallengesRequest => ({
  challenges: challenges.map(toCreateChallengeRequest),
})

const toCreateChallengeRequest = (challenge: ChallengeDto): ChallengeRequest => ({
  prisonId: challenge.prisonId,
  challengeTypeCode: challenge.challengeTypeCode,
  symptoms: challenge.symptoms,
  howIdentified: challenge.howIdentified,
  howIdentifiedOther: challenge.howIdentifiedOther,
})

export { toCreateChallengesRequest, toCreateChallengeRequest }
