import type { ReferenceDataItemDto } from 'dto'
import ReferenceDataDomain from '../../enums/referenceDataDomain'

export default interface ReferenceDataStore {
  getReferenceData(
    domain: ReferenceDataDomain,
    includeInactive: boolean,
  ): Promise<Record<string, Array<ReferenceDataItemDto>>>

  setReferenceData(
    domain: ReferenceDataDomain,
    includeInactive: boolean,
    referenceData: Record<string, Array<ReferenceDataItemDto>>,
    durationHours: number,
  ): Promise<void>

  getReferenceDataCategories(
    domain: ReferenceDataDomain,
    includeInactive: boolean,
  ): Promise<Array<ReferenceDataItemDto>>

  setReferenceDataCategories(
    domain: ReferenceDataDomain,
    includeInactive: boolean,
    referenceDataCategories: Array<ReferenceDataItemDto>,
    durationHours: number,
  ): Promise<void>
}
