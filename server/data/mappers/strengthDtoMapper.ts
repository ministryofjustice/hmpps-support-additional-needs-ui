import { parseISO } from 'date-fns'
import type { StrengthDto, StrengthsList } from 'dto'
import type { StrengthListResponse, StrengthResponse } from 'supportAdditionalNeedsApiClient'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toStrengthsList = (strengthListResponse: StrengthListResponse, prisonNumber: string): StrengthsList => ({
  prisonNumber,
  strengths: strengthListResponse?.strengths.map(toStrengthDto) || [],
})

const toStrengthDto = (strengthResponse: StrengthResponse): StrengthDto => ({
  ...toReferenceAndAuditable(strengthResponse),
  strengthTypeCode: strengthResponse.strengthType.code,
  strengthCategory: strengthResponse.strengthType.categoryCode,
  symptoms: strengthResponse.symptoms,
  howIdentified: strengthResponse.howIdentified,
  howIdentifiedOther: strengthResponse.howIdentifiedOther,
  active: strengthResponse.active,
  fromALNScreener: strengthResponse.fromALNScreener,
  alnScreenerDate: strengthResponse.alnScreenerDate ? parseISO(strengthResponse.alnScreenerDate) : null,
})

export { toStrengthsList, toStrengthDto }
