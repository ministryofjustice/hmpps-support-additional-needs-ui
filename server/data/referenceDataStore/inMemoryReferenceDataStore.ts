import type { ReferenceDataListResponse } from 'supportAdditionalNeedsApiClient'
import ReferenceDataStore from './referenceDataStore'
import ReferenceDataDomain from '../../enums/referenceDataDomain'

export default class InMemoryReferenceDataStore implements ReferenceDataStore {
  private referenceData: Map<string, ReferenceDataListResponse> = new Map()

  async getReferenceData(
    domain: ReferenceDataDomain,
    categoriesOnly: boolean,
    includeInactive: boolean,
  ): Promise<ReferenceDataListResponse> {
    return Promise.resolve(
      this.referenceData.get(
        `${domain}${categoriesOnly ? '.categories' : ''}.${includeInactive ? 'includesInactive' : 'excludesInactive'}`,
      ),
    )
  }

  async setReferenceData(
    domain: ReferenceDataDomain,
    categoriesOnly: boolean,
    includeInactive: boolean,
    referenceData: ReferenceDataListResponse,
    _durationHours: number,
  ): Promise<void> {
    this.referenceData.set(
      `${domain}${categoriesOnly ? '.categories' : ''}.${includeInactive ? 'includesInactive' : 'excludesInactive'}`,
      referenceData,
    )
    return Promise.resolve()
  }
}
