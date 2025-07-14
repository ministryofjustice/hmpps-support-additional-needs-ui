import type { ReferenceDataListResponse } from 'supportAdditionalNeedsApiClient'
import type { ReferenceDataItemDto } from 'dto'
import { ReferenceDataStore, SupportAdditionalNeedsApiClient } from '../data'
import ReferenceDataDomain from '../enums/referenceDataDomain'
import { toGroupedReferenceDataItems, toReferenceDataItems } from '../data/mappers/referenceDataListResponseMapper'
import logger from '../../logger'

const REFERENCE_DATA_CACHE_TTL_HOURS = 24

export default class ReferenceDataService {
  constructor(
    private readonly referenceDataStore: ReferenceDataStore,
    private readonly supportAdditionalNeedsApiClient: SupportAdditionalNeedsApiClient,
  ) {}

  /**
   * Returns the Conditions reference data items, grouped by the Condition categoryCode
   */
  async getConditions(
    username: string,
    includeInactive: boolean = false,
  ): Promise<Record<string, Array<ReferenceDataItemDto>>> {
    return toGroupedReferenceDataItems(
      (await this.getCachedReferenceData(ReferenceDataDomain.CONDITION, false, includeInactive)) ||
        (await this.retrieveAndCacheReferenceData(ReferenceDataDomain.CONDITION, false, includeInactive, username)),
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
      (await this.getCachedReferenceData(ReferenceDataDomain.CHALLENGE, false, includeInactive)) ||
        (await this.retrieveAndCacheReferenceData(ReferenceDataDomain.CHALLENGE, false, includeInactive, username)),
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
      (await this.getCachedReferenceData(ReferenceDataDomain.CHALLENGE, true, includeInactive)) ||
        (await this.retrieveAndCacheReferenceData(ReferenceDataDomain.CHALLENGE, true, includeInactive, username)),
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
      (await this.getCachedReferenceData(ReferenceDataDomain.STRENGTH, false, includeInactive)) ||
        (await this.retrieveAndCacheReferenceData(ReferenceDataDomain.STRENGTH, false, includeInactive, username)),
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
      (await this.getCachedReferenceData(ReferenceDataDomain.STRENGTH, true, includeInactive)) ||
        (await this.retrieveAndCacheReferenceData(ReferenceDataDomain.STRENGTH, true, includeInactive, username)),
    )
  }

  private async getCachedReferenceData(
    domain: ReferenceDataDomain,
    categoriesOnly: boolean,
    includeInactive: boolean,
  ): Promise<ReferenceDataListResponse> {
    try {
      const referenceData = await this.referenceDataStore.getReferenceData(domain, categoriesOnly, includeInactive)
      if (referenceData) {
        return referenceData
      }
      logger.debug(`Reference Data not found in cache`)
    } catch (ex) {
      // Looking up the Reference Data from the cached data store failed for some reason. Return undefined.
      logger.error('Error retrieving cached Reference Data', ex)
    }
    return undefined
  }

  /**
   * Calls the Support for Additional Needs API to retrieve Reference Data, then caches it in the cache.
   * Returns the cached Reference Data.
   */
  private async retrieveAndCacheReferenceData(
    domain: ReferenceDataDomain,
    categoriesOnly: boolean,
    includeInactive: boolean,
    username: string,
  ): Promise<ReferenceDataListResponse> {
    logger.info(`Retrieving and caching Reference Data${categoriesOnly ? ' Categories' : ''} for domain ${domain}`)
    let referenceData: ReferenceDataListResponse
    try {
      referenceData = await this.supportAdditionalNeedsApiClient.getReferenceData(username, domain, {
        categoriesOnly,
        includeInactive,
      })
    } catch (ex) {
      // Retrieving Reference Data from the API failed.
      logger.error('Error retrieving Reference Data', ex)
      throw ex
    }

    try {
      await this.referenceDataStore.setReferenceData(
        domain,
        categoriesOnly,
        includeInactive,
        referenceData,
        REFERENCE_DATA_CACHE_TTL_HOURS,
      )
    } catch (ex) {
      // Caching Reference Data retrieved from the API failed. Log a warning but return the Reference Data anyway. Next time the service is called the caching will be retried.
      logger.warn('Error caching Reference Data', ex)
    }
    return referenceData
  }
}
