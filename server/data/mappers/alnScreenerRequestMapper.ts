import { format } from 'date-fns'
import type { AlnScreenerRequest } from 'supportAdditionalNeedsApiClient'
import type { AlnScreenerDto } from 'dto'
import ChallengeType from '../../enums/challengeType'
import StrengthType from '../../enums/strengthType'

const toAlnScreenerRequest = (alnScreenerDto: AlnScreenerDto): AlnScreenerRequest => ({
  prisonId: alnScreenerDto.prisonId,
  screenerDate: format(alnScreenerDto.screenerDate, 'yyyy-MM-dd'),
  challenges: alnScreenerDto.challenges
    .filter(challengeTypeCode => challengeTypeCode !== ChallengeType.NONE) // NONE is used to populate the UI; it is not a value that should be mapped to the API request
    .map(challengeTypeCode => ({ challengeTypeCode })),
  strengths: alnScreenerDto.strengths
    .filter(strengthTypeCode => strengthTypeCode !== StrengthType.NONE) // NONE is used to populate the UI; it is not a value that should be mapped to the API request
    .map(strengthTypeCode => ({ strengthTypeCode })),
})

export default toAlnScreenerRequest
