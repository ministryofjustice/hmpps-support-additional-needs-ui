import type { ConditionDto, ConditionsList } from 'dto'
import type { ConditionListResponse, ConditionResponse } from 'supportAdditionalNeedsApiClient'
import toReferenceAndAuditable from './referencedAndAuditableMapper'

const toConditionsList = (
  conditionListResponse: ConditionListResponse,
  prisonNumber: string,
  prisonNamesById: Map<string, string>,
): ConditionsList => ({
  prisonNumber,
  conditions: conditionListResponse
    ? (conditionListResponse?.conditions as Array<ConditionResponse>).map(condition =>
        toConditionDto(condition, prisonNamesById),
      )
    : [],
})

const toConditionDto = (conditionResponse: ConditionResponse, prisonNamesById: Map<string, string>): ConditionDto => ({
  ...toReferenceAndAuditable(conditionResponse, prisonNamesById),
  conditionTypeCode: conditionResponse.conditionType.code,
  conditionName: conditionResponse.conditionName,
  conditionDetails: conditionResponse.conditionDetails,
  source: conditionResponse.source,
  active: conditionResponse.active,
})

export { toConditionsList, toConditionDto }
