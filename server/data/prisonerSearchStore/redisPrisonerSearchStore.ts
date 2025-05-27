import type { Prisoner } from 'prisonerSearchApiClient'
import { RedisClient } from '../redisClient'
import logger from '../../../logger'
import { PrisonerSearchStore } from './prisonerSearchStore'

export default class RedisPrisonerSearchStore implements PrisonerSearchStore {
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

  async setPrisoner(prisoner: Prisoner, durationHours = 24): Promise<string> {
    await this.ensureConnected()
    return this.client.set(`prisoner.${prisoner.prisonerNumber}`, JSON.stringify(prisoner), {
      EX: durationHours * 60 * 60,
    })
  }

  async getPrisoner(prisonNumber: string): Promise<Prisoner> {
    await this.ensureConnected()
    const serializedPrisoner = await this.client.get(`prisoner.${prisonNumber}`)
    return serializedPrisoner ? (JSON.parse(serializedPrisoner) as Prisoner) : undefined
  }
}
