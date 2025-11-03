import type { StrengthListResponse, StrengthResponse } from 'supportAdditionalNeedsApiClient'
import type { StrengthResponseDto } from 'dto'
import { parseISO } from 'date-fns'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toStrengthDto = (prisonNumber: string, apiResponse: StrengthListResponse): StrengthResponseDto[] => {
  return ((apiResponse?.strengths || []) as Array<StrengthResponse>).map(strength =>
    toStrengthResponseDto(prisonNumber, strength),
  )
}

const toStrengthResponseDto = (prisonNumber: string, strength: StrengthResponse): StrengthResponseDto => {
  return strength
    ? {
        ...toReferenceAndAuditable(strength),
        prisonNumber,
        fromALNScreener: strength.fromALNScreener,
        strengthTypeCode: strength.strengthType.code,
        strengthCategory: strength.strengthType.categoryCode,
        symptoms: strength.symptoms,
        howIdentified: strength.howIdentified,
        active: strength.active,
        howIdentifiedOther: strength.howIdentifiedOther,
        alnScreenerDate: strength.alnScreenerDate ? parseISO(strength.alnScreenerDate) : null,
      }
    : null
}

export { toStrengthDto, toStrengthResponseDto }
