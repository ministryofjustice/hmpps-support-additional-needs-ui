import type { ReferenceDataListResponse } from 'supportAdditionalNeedsApiClient'
import ReferenceDataDomain from '../../enums/referenceDataDomain'

export default interface ReferenceDataStore {
  getReferenceData(
    domain: ReferenceDataDomain,
    categoriesOnly: boolean,
    includeInactive: boolean,
  ): Promise<ReferenceDataListResponse>

  setReferenceData(
    domain: ReferenceDataDomain,
    categoriesOnly: boolean,
    includeInactive: boolean,
    referenceData: ReferenceDataListResponse,
    durationHours: number,
  ): Promise<void>
}
