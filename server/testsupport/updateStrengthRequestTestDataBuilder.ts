import type { UpdateStrengthRequest } from 'supportAdditionalNeedsApiClient'
import StrengthIdentificationSource from '../enums/strengthIdentificationSource'

const anUpdateStrengthRequest = (options?: {
  prisonId?: string
  symptoms?: string
  howIdentified?: Array<StrengthIdentificationSource>
  howIdentifiedOther?: string
}): UpdateStrengthRequest => ({
  prisonId: options?.prisonId || 'BXI',
  symptoms:
    options?.symptoms === null ? null : options?.symptoms || 'John can read and understand written language very well',
  howIdentified: options?.howIdentified || [StrengthIdentificationSource.CONVERSATIONS],
  howIdentifiedOther:
    options?.howIdentifiedOther === null
      ? null
      : options?.howIdentifiedOther || `John's reading strength was discovered during a poetry recital evening`,
})

export default anUpdateStrengthRequest
