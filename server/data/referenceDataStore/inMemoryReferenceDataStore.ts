import type { ReferenceDataItemDto } from 'dto'
import ReferenceDataStore from './referenceDataStore'
import ReferenceDataDomain from '../../enums/referenceDataDomain'

export default class InMemoryReferenceDataStore implements ReferenceDataStore {
  private referenceData: Map<string, Record<string, Array<ReferenceDataItemDto>>> = new Map()

  private referenceDataCategories: Map<string, Array<ReferenceDataItemDto>> = new Map()

  async getReferenceData(
    domain: ReferenceDataDomain,
    includeInactive: boolean,
  ): Promise<Record<string, Array<ReferenceDataItemDto>>> {
    return Promise.resolve(
      this.referenceData.get(`${domain}.${includeInactive ? 'includesInactive' : 'excludesInactive'}`),
    )
  }

  async setReferenceData(
    domain: ReferenceDataDomain,
    includeInactive: boolean,
    referenceData: Record<string, Array<ReferenceDataItemDto>>,
    _durationHours: number,
  ): Promise<void> {
    this.referenceData.set(`${domain}.${includeInactive ? 'includesInactive' : 'excludesInactive'}`, referenceData)
    return Promise.resolve()
  }

  async getReferenceDataCategories(
    domain: ReferenceDataDomain,
    includeInactive: boolean,
  ): Promise<Array<ReferenceDataItemDto>> {
    return Promise.resolve(
      this.referenceDataCategories.get(`${domain}.${includeInactive ? 'includesInactive' : 'excludesInactive'}`),
    )
  }

  async setReferenceDataCategories(
    domain: ReferenceDataDomain,
    includeInactive: boolean,
    referenceDataCategories: Array<ReferenceDataItemDto>,
    _durationHours: number,
  ): Promise<void> {
    this.referenceDataCategories.set(
      `${domain}.${includeInactive ? 'includesInactive' : 'excludesInactive'}`,
      referenceDataCategories,
    )
    return Promise.resolve()
  }
}
