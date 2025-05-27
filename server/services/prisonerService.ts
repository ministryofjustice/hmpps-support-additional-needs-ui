import type { PrisonerSummary } from 'viewModels'
import type { Prisoner } from 'prisonerSearchApiClient'
import { PrisonerSearchStore } from '../data/prisonerSearchStore/prisonerSearchStore'
import PrisonerSearchClient from '../data/prisonerSearchClient'
import logger from '../../logger'
import toPrisonerSummary from '../data/mappers/prisonerSummaryMapper'

const PRISONER_CACHE_TTL_HOURS = 1

export default class PrisonerService {
  constructor(
    private readonly prisonerSearchStore: PrisonerSearchStore,
    private readonly prisonerSearchClient: PrisonerSearchClient,
  ) {}

  async getPrisonerByPrisonNumber(prisonNumber: string, username: string): Promise<PrisonerSummary> {
    return toPrisonerSummary(
      (await this.getCachedPrisoner(prisonNumber)) || (await this.retrieveAndCachePrisoner(prisonNumber, username)),
    )
  }

  private async getCachedPrisoner(prisonNumber: string): Promise<Prisoner> {
    try {
      const prisoner = await this.prisonerSearchStore.getPrisoner(prisonNumber)
      if (prisoner) {
        return prisoner
      }
      logger.debug(`Prisoner not found in cache`)
    } catch (ex) {
      // Looking up the prisoner from the cached data store failed for some reason. Return undefined.
      logger.error('Error retrieving cached prisoner', ex)
    }
    return undefined
  }

  /**
   * Calls the prisoner-search API to retrieve a given prisoner, then caches it in the cache.
   * Returns the cached prisoner.
   */
  private async retrieveAndCachePrisoner(prisonNumber: string, username: string): Promise<Prisoner> {
    logger.info(`Retrieving and caching prisoner ${prisonNumber}`)
    let prisoner: Prisoner
    try {
      prisoner = await this.prisonerSearchClient.getPrisonerByPrisonNumber(prisonNumber, username)
    } catch (ex) {
      // Retrieving prisoner from the API failed.
      logger.error('Error retrieving prisons', ex)
      throw ex
    }

    try {
      await this.prisonerSearchStore.setPrisoner(prisoner, PRISONER_CACHE_TTL_HOURS)
    } catch (ex) {
      // Caching prisoner retrieved from the API failed. Log a warning but return the prisoner anyway. Next time the service is called the caching will be retried.
      logger.warn('Error caching prisoner', ex)
    }
    return prisoner
  }
}
