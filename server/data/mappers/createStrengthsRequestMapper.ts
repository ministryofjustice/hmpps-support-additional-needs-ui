import type { CreateStrengthsRequest, StrengthRequest } from 'supportAdditionalNeedsApiClient'
import type { StrengthDto } from 'dto'

const toCreateStrengthsRequest = (strengths: Array<StrengthDto>): CreateStrengthsRequest => ({
  strengths: strengths.map(toCreateStrengthRequest),
})

const toCreateStrengthRequest = (strength: StrengthDto): StrengthRequest => ({
  prisonId: strength.prisonId,
  strengthTypeCode: strength.strengthTypeCode,
  symptoms: strength.symptoms,
  howIdentified: strength.howIdentified,
  howIdentifiedOther: strength.howIdentifiedOther,
})

export { toCreateStrengthsRequest, toCreateStrengthRequest }
