import type { UpdateStrengthRequest } from 'supportAdditionalNeedsApiClient'
import type { StrengthDto } from 'dto'

const toUpdateStrengthRequest = (strength: StrengthDto): UpdateStrengthRequest => ({
  prisonId: strength.prisonId,
  symptoms: strength.symptoms,
  howIdentified: strength.howIdentified,
  howIdentifiedOther: strength.howIdentifiedOther,
})

export default toUpdateStrengthRequest
