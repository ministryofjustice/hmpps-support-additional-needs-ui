import type { UserCaseloadDetail } from 'manageUsersApiClient'
import { RedisClient } from '../redisClient'
import logger from '../../../logger'
import UserCaseloadDetailStore from './userCaseloadDetailStore'

export default class RedisUserCaseloadDetailStore implements UserCaseloadDetailStore {
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

  async setUserCaseloadDetail(userCaseloadDetail: UserCaseloadDetail, durationHours = 1): Promise<string> {
    await this.ensureConnected()
    return this.client.set(`userCaseloadDetail.${userCaseloadDetail.username}`, JSON.stringify(userCaseloadDetail), {
      EX: durationHours * 60 * 60,
    })
  }

  async getUserCaseloadDetail(username: string): Promise<UserCaseloadDetail> {
    await this.ensureConnected()
    const serializedUserCaseloadDetail = await this.client.get(`userCaseloadDetail.${username}`)
    return serializedUserCaseloadDetail ? JSON.parse(serializedUserCaseloadDetail) : null
  }
}
