import type { ReferenceDataListResponse } from 'supportAdditionalNeedsApiClient'
import ReferenceDataStore from './referenceDataStore'
import ReferenceDataDomain from '../../enums/referenceDataDomain'
import { RedisClient } from '../redisClient'
import logger from '../../../logger'

export default class RedisReferenceDataStore implements ReferenceDataStore {
  constructor(private readonly client: RedisClient) {
    client.on('error', error => {
      logger.error(error, `Redis error`)
    })
  }

  private async ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect()
    }
  }

  async getReferenceData(
    domain: ReferenceDataDomain,
    categoriesOnly: boolean,
    includeInactive: boolean,
  ): Promise<ReferenceDataListResponse> {
    await this.ensureConnected()
    const serializedReferenceData = await this.client.get(
      `${domain}${categoriesOnly ? '.categories' : ''}.${includeInactive ? 'includesInactive' : 'excludesInactive'}`,
    )
    return serializedReferenceData
      ? (JSON.parse(serializedReferenceData.toString()) as ReferenceDataListResponse)
      : undefined
  }

  async setReferenceData(
    domain: ReferenceDataDomain,
    categoriesOnly: boolean,
    includeInactive: boolean,
    referenceData: ReferenceDataListResponse,
    durationHours = 24,
  ): Promise<void> {
    await this.ensureConnected()
    this.client.set(
      `${domain}${categoriesOnly ? '.categories' : ''}.${includeInactive ? 'includesInactive' : 'excludesInactive'}`,
      JSON.stringify(referenceData),
      { EX: durationHours * 60 * 60 },
    )
  }
}
