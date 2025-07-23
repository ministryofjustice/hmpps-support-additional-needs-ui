import { format } from 'date-fns'
import type { AlnScreenerRequest } from 'supportAdditionalNeedsApiClient'
import type { AlnScreenerDto } from 'dto'

const toAlnScreenerRequest = (alnScreenerDto: AlnScreenerDto): AlnScreenerRequest => ({
  prisonId: alnScreenerDto.prisonId,
  screenerDate: format(alnScreenerDto.screenerDate, 'yyyy-MM-dd'),
  challenges: alnScreenerDto.challenges.map(challengeTypeCode => ({ challengeTypeCode })),
  strengths: alnScreenerDto.strengths.map(strengthTypeCode => ({ strengthTypeCode })),
})

export default toAlnScreenerRequest
