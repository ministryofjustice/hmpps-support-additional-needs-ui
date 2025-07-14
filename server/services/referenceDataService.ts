import type { ReferenceDataListResponse } from 'supportAdditionalNeedsApiClient'
import type { ReferenceDataItemDto } from 'dto'
import { SupportAdditionalNeedsApiClient } from '../data'
import ReferenceDataDomain from '../enums/referenceDataDomain'
import { toGroupedReferenceDataItems, toReferenceDataItems } from '../data/mappers/referenceDataListResponseMapper'

export default class ReferenceDataService {
  constructor(private readonly supportAdditionalNeedsApiClient: SupportAdditionalNeedsApiClient) {}

  /**
   * Returns the Conditions reference data items, grouped by the Condition categoryCode
   */
  async getConditions(
    username: string,
    includeInactive: boolean = false,
  ): Promise<Record<string, Array<ReferenceDataItemDto>>> {
    return toGroupedReferenceDataItems(
      await this.getReferenceData(username, ReferenceDataDomain.CONDITION, false, includeInactive),
    )
  }

  /**
   * Returns the Challenges reference data items, grouped by the Challenge categoryCode
   */
  async getChallenges(
    username: string,
    includeInactive: boolean = false,
  ): Promise<Record<string, Array<ReferenceDataItemDto>>> {
    return toGroupedReferenceDataItems(
      await this.getReferenceData(username, ReferenceDataDomain.CHALLENGE, false, includeInactive),
    )
  }

  /**
   * Returns the set of Challenge Categories reference data items
   */
  async getChallengeCategories(
    username: string,
    includeInactive: boolean = false,
  ): Promise<Array<ReferenceDataItemDto>> {
    return toReferenceDataItems(
      await this.getReferenceData(username, ReferenceDataDomain.CHALLENGE, true, includeInactive),
    )
  }

  /**
   * Returns the Strengths reference data items, grouped by the Strength categoryCode
   */
  async getStrengths(
    username: string,
    includeInactive: boolean = false,
  ): Promise<Record<string, Array<ReferenceDataItemDto>>> {
    return toGroupedReferenceDataItems(
      await this.getReferenceData(username, ReferenceDataDomain.STRENGTH, false, includeInactive),
    )
  }

  /**
   * Returns the set of Strength Categories reference data items
   */
  async getStrengthCategories(
    username: string,
    includeInactive: boolean = false,
  ): Promise<Array<ReferenceDataItemDto>> {
    return toReferenceDataItems(
      await this.getReferenceData(username, ReferenceDataDomain.STRENGTH, true, includeInactive),
    )
  }

  private async getReferenceData(
    username: string,
    domain: ReferenceDataDomain,
    categoriesOnly: boolean,
    includeInactive: boolean,
  ): Promise<ReferenceDataListResponse> {
    return this.supportAdditionalNeedsApiClient.getReferenceData(username, domain, { categoriesOnly, includeInactive })
  }
}
