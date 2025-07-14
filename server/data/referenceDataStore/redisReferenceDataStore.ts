import type { ReferenceDataItemDto } from 'dto'
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
    includeInactive: boolean,
  ): Promise<Record<string, Array<ReferenceDataItemDto>>> {
    await this.ensureConnected()
    const serializedReferenceData = await this.client.get(
      `referenceData.${domain}.${includeInactive ? 'includesInactive' : 'excludesInactive'}`,
    )
    return serializedReferenceData
      ? (JSON.parse(serializedReferenceData.toString()) as Record<string, Array<ReferenceDataItemDto>>)
      : undefined
  }

  async setReferenceData(
    domain: ReferenceDataDomain,
    includeInactive: boolean,
    referenceData: Record<string, Array<ReferenceDataItemDto>>,
    durationHours = 24,
  ): Promise<void> {
    await this.ensureConnected()
    this.client.set(
      `referenceData.${domain}.${includeInactive ? 'includesInactive' : 'excludesInactive'}`,
      JSON.stringify(referenceData),
      { EX: durationHours * 60 * 60 },
    )
  }

  async getReferenceDataCategories(
    domain: ReferenceDataDomain,
    includeInactive: boolean,
  ): Promise<Array<ReferenceDataItemDto>> {
    await this.ensureConnected()
    const serializedReferenceDataCategories = await this.client.get(
      `referenceDataCategories.${domain}.${includeInactive ? 'includesInactive' : 'excludesInactive'}`,
    )
    return serializedReferenceDataCategories
      ? (JSON.parse(serializedReferenceDataCategories.toString()) as Array<ReferenceDataItemDto>)
      : undefined
  }

  async setReferenceDataCategories(
    domain: ReferenceDataDomain,
    includeInactive: boolean,
    referenceDataCategories: Array<ReferenceDataItemDto>,
    durationHours = 24,
  ): Promise<void> {
    await this.ensureConnected()
    this.client.set(
      `referenceDataCategories.${domain}.${includeInactive ? 'includesInactive' : 'excludesInactive'}`,
      JSON.stringify(referenceDataCategories),
      { EX: durationHours * 60 * 60 },
    )
  }
}
