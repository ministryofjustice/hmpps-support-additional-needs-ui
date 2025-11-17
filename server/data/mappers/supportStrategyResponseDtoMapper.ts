import type { SupportStrategyResponseDto } from 'dto'
import type { SupportStrategyListResponse, SupportStrategyResponse } from 'supportAdditionalNeedsApiClient'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toSupportStrategyResponseDtos = (
  apiResponse: SupportStrategyListResponse,
  prisonNumber: string,
): SupportStrategyResponseDto[] => {
  return ((apiResponse?.supportStrategies || []) as Array<SupportStrategyResponse>).map(supportStrategy =>
    toSupportStrategyResponseDto(prisonNumber, supportStrategy),
  )
}

const toSupportStrategyResponseDto = (
  prisonNumber: string,
  supportStrategyResponse: SupportStrategyResponse,
): SupportStrategyResponseDto =>
  supportStrategyResponse
    ? {
        ...toReferenceAndAuditable(supportStrategyResponse),
        prisonNumber,
        supportStrategyTypeCode: supportStrategyResponse.supportStrategyType.code,
        supportStrategyDetails: supportStrategyResponse.detail,
        supportStrategyCategory: supportStrategyResponse.supportStrategyType.categoryCode,
        active: supportStrategyResponse.active,
        archiveReason: supportStrategyResponse.archiveReason,
      }
    : null

export { toSupportStrategyResponseDto, toSupportStrategyResponseDtos }
