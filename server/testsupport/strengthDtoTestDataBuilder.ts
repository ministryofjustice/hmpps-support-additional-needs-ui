import type { StrengthDto } from 'dto'
import StrengthIdentificationSource from '../enums/strengthIdentificationSource'
import StrengthType from '../enums/strengthType'

const aValidStrengthDto = (options?: {
  prisonNumber?: string
  prisonId?: string
  strengthTypeCode?: StrengthType
  symptoms?: string
  howIdentified?: Array<StrengthIdentificationSource>
  howIdentifiedOther?: string
  archiveReason?: string
}): StrengthDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  strengthTypeCode: options?.strengthTypeCode || StrengthType.READING_COMPREHENSION,
  symptoms:
    options?.symptoms === null ? null : options?.symptoms || 'John can read and understand written language very well',
  howIdentified: options?.howIdentified || [StrengthIdentificationSource.CONVERSATIONS],
  howIdentifiedOther:
    options?.howIdentifiedOther === null
      ? null
      : options?.howIdentifiedOther || `John's reading strength was discovered during a poetry recital evening`,
  archiveReason: options?.archiveReason,
})

export default aValidStrengthDto
