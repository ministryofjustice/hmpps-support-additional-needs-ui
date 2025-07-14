import type { ReferenceDataItemDto } from 'dto'
import type { ReferenceData, ReferenceDataListResponse } from 'supportAdditionalNeedsApiClient'

const toGroupedReferenceDataItems = (
  referenceData: ReferenceDataListResponse,
): Record<string, Array<ReferenceDataItemDto>> => {
  const { referenceDataList } = referenceData
  return (referenceDataList as Array<ReferenceData>).reduce<Record<string, Array<ReferenceDataItemDto>>>(
    (previousValue, referenceDataItem) => {
      const returnValue = { ...previousValue }
      if (!returnValue[referenceDataItem.categoryCode]) {
        returnValue[referenceDataItem.categoryCode] = []
      }
      returnValue[referenceDataItem.categoryCode].push({
        code: referenceDataItem.code,
        areaCode: referenceDataItem.areaCode,
      })
      return returnValue
    },
    {},
  )
}

const toReferenceDataItems = (referenceData: ReferenceDataListResponse): Array<ReferenceDataItemDto> => {
  const { referenceDataList } = referenceData
  return (referenceDataList as Array<ReferenceData>).map(referenceDataItem => ({
    code: referenceDataItem.code,
    areaCode: referenceDataItem.areaCode,
  }))
}

export { toGroupedReferenceDataItems, toReferenceDataItems }
