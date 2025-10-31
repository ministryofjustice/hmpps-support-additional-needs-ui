import type { UpdateChallengeRequest } from 'supportAdditionalNeedsApiClient'
import type { ChallengeDto } from 'dto'

const toUpdateChallengeRequest = (challenge: ChallengeDto): UpdateChallengeRequest => ({
  prisonId: challenge.prisonId,
  symptoms: challenge.symptoms,
  howIdentified: challenge.howIdentified,
  howIdentifiedOther: challenge.howIdentifiedOther,
})

export default toUpdateChallengeRequest
