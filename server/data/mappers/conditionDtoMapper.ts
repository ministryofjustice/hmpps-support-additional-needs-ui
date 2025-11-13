import type { ConditionDto, ConditionsList } from 'dto'
import type { ConditionListResponse, ConditionResponse } from 'supportAdditionalNeedsApiClient'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toConditionsList = (conditionListResponse: ConditionListResponse, prisonNumber: string): ConditionsList => ({
  prisonNumber,
  conditions:
    ((conditionListResponse?.conditions || []) as Array<ConditionResponse>).map(condition =>
      toConditionDto(prisonNumber, condition),
    ) || [],
})

const toConditionDto = (prisonNumber: string, conditionResponse: ConditionResponse): ConditionDto =>
  conditionResponse
    ? {
        ...toReferenceAndAuditable(conditionResponse),
        prisonId: null,
        prisonNumber,
        conditionTypeCode: conditionResponse.conditionType.code,
        conditionName: conditionResponse.conditionName,
        conditionDetails: conditionResponse.conditionDetails,
        source: conditionResponse.source,
        active: conditionResponse.active,
        archiveReason: conditionResponse.archiveReason,
      }
    : null

export { toConditionsList, toConditionDto }
