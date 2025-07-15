import type { CreateStrengthsRequest, StrengthRequest } from 'supportAdditionalNeedsApiClient'
import StrengthIdentificationSource from '../enums/strengthIdentificationSource'

const aValidCreateStrengthsRequest = (options?: { strengths?: Array<StrengthRequest> }): CreateStrengthsRequest => ({
  strengths: options?.strengths || [aValidStrengthRequest()],
})

const aValidStrengthRequest = (options?: {
  prisonId?: string
  strengthTypeCode?: string
  symptoms?: string
  howIdentified?: Array<StrengthIdentificationSource>
  howIdentifiedOther?: string
}): StrengthRequest => ({
  prisonId: options?.prisonId || 'BXI',
  strengthTypeCode: options?.strengthTypeCode || 'READING_COMPREHENSION',
  symptoms:
    options?.symptoms === null ? null : options?.symptoms || 'John can read and understand written language very well',
  howIdentified: options?.howIdentified || [StrengthIdentificationSource.CONVERSATIONS],
  howIdentifiedOther:
    options?.howIdentifiedOther === null
      ? null
      : options?.howIdentifiedOther || `John's reading strength was discovered during a poetry recital evening`,
})

export { aValidStrengthRequest, aValidCreateStrengthsRequest }
