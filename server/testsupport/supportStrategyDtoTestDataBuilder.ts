import type { SupportStrategyDto } from 'dto'
import SupportStrategyType from '../enums/supportStrategyType'

const aValidSupportStrategyDto = (options?: {
  prisonNumber?: string
  prisonId?: string
  supportStrategyTypeCode?: SupportStrategyType
  supportStrategyDetails?: string
  archiveReason?: string
}): SupportStrategyDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  supportStrategyTypeCode: options?.supportStrategyTypeCode || SupportStrategyType.MEMORY,
  supportStrategyDetails:
    options?.supportStrategyDetails === null
      ? null
      : options?.supportStrategyDetails || 'Using flash cards with John can help him retain facts',
  archiveReason: options?.archiveReason,
})

export default aValidSupportStrategyDto
